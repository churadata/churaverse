import { detectEntityOverlap } from '../domain/core/collisionDetection/collistionDetection'
import { Direction } from '../domain/core/direction'
import { Bomb } from '../domain/model/bomb'
import { Player, PlayerColorName, PLAYER_RESPAWN_WAITING_TIME_MS } from '../domain/model/player'
import { Shark } from '../domain/model/shark'
import { Position } from '../domain/core/position'
import { IBombRepository } from '../domain/IRepository/IBombRepository'
import { IPlayerRepository } from '../domain/IRepository/IPlayerRepository'
import { ISharkRepository } from '../domain/IRepository/ISharkRepository'
import { checkExplode, removeExplodedBomb } from '../domain/service/bombService'
import { movePlayers } from '../domain/service/playerService'
import { moveSharks, removeDieShark } from '../domain/service/sharkService'
import { IMapManager } from './IMapManager'
import { ISocketEmitter } from './IEmitter/ISocketEmitter'
import { DamageCause } from '../domain/model/deathLog'
import { IMegaphoneUserRepository } from '../domain/IRepository/IMegaphoneUserRepository'

// acknowledgements対応のためimportを許可
// eslint-disable-next-line import/no-restricted-paths
import { PreloadedDataIngredients } from '../interface/socket/eventTypes'
import { WorldConfig } from '../domain/model/worldConfig'

export class Interactor {
  private readonly sessionId = Math.random().toString(36).slice(-8)

  public constructor(
    private readonly worldConfig: WorldConfig,
    private readonly mapManager: IMapManager,
    private readonly players: IPlayerRepository,
    private readonly sharks: ISharkRepository,
    private readonly bombs: IBombRepository,
    private readonly megaphoneUsers: IMegaphoneUserRepository,
    private readonly emitter: ISocketEmitter
  ) {}

  public joinPlayer(id: string, player: Player): void {
    this.players.set(id, player)
    this.emitter.emitNewPlayer(id, player)
    this.toggleMegaphone(id, true)

    console.log(this.sessionId, player.name, '現在接続数:', this.players.getAllId().length)
  }

  public leavePlayer(id: string): void {
    if (this.players.get(id) !== undefined) {
      this.players.delete(id)
      this.megaphoneUsers.delete(id)
      this.emitter.emitLeavePlayer(id)
    }
  }

  public turnPlayer(id: string, direction: Direction): void {
    this.players.get(id)?.turn(direction)
  }

  public walkPlayer(id: string, startPos: Position, direction: Direction, speed: number): void {
    const player = this.players.get(id)
    if (player?.isDead === true) {
      player?.stop()
    } else {
      const velocity = { x: speed * direction.x, y: speed * direction.y }
      player?.walk(startPos, direction, velocity)
    }
  }

  public requestKickPlayer(kickedId: string, kickerId: string): void {
    this.leavePlayer(kickedId)
    this.emitter.requestKickPlayer(kickedId, kickerId)
  }

  public async newMap(mapName: string): Promise<void> {
    await this.reloadMap(mapName)
    this.emitter.newMap(mapName)
  }

  public stopPlayer(id: string, position: Position, direction: Direction): void {
    const player = this.players.get(id)
    if (player === undefined) return
    player.stop()

    // 位置・向きを補正
    player.teleport(position)
    player.turn(direction)
  }

  public damagePlayer(attacker: string, target: string, cause: DamageCause, amount: number): void {
    if (this.worldConfig.isInvincibleMode) return

    const player = this.players.get(target)
    player?.damage(amount)
    this.emitter.emitDamage(attacker, target, cause, amount)

    if (player?.isDead ?? false) {
      player?.stop()
      this.emitter.emitPlayerDie(target)

      // PLAYER_RESPAWN_WAITING_TIME_MS後にリスポーン
      setTimeout(() => {
        this.respawnPlayer(target)
      }, PLAYER_RESPAWN_WAITING_TIME_MS)
    }
  }

  public respawnPlayer(id: string): void {
    const player = this.players.get(id)
    if (player === undefined) return

    // ランダムな通行可能マスの座標を取得
    const position = this.mapManager.currentMap.getRandomSpawnPoint()

    player.respawn(position)
    this.emitter.emitPlayerRespawn(id, player.position, player.direction)
  }

  public changePlayerName(id: string, name: string): void {
    this.players.get(id)?.setPlayerName(name)
  }

  public changePlayerColor(id: string, color: PlayerColorName): void {
    this.players.get(id)?.setPlayerColor(color)
  }

  public spawnShark(sharkId: string, shark: Shark): void {
    this.sharks.set(sharkId, shark)
    shark.walk(this.mapManager.currentMap)
  }

  public dieShark(sharkId: string): void {
    this.sharks.get(sharkId)?.die()
    this.emitter.emitHitShark(sharkId)
  }

  public dropBomb(bombId: string, bomb: Bomb): void {
    this.bombs.set(bombId, bomb)
  }

  public toggleMegaphone(id: string, active: boolean): void {
    if (active) {
      this.megaphoneUsers.set(id, true)
    } else {
      this.megaphoneUsers.set(id, false)
    }
  }

  public async reloadMap(mapName: string): Promise<void> {
    await this.mapManager.reloadMap(mapName)
    this.players.updateMap(this.mapManager.currentMap)
    this.sharks.updateMap(this.mapManager.currentMap)
    this.bombs.updateMap(this.mapManager.currentMap)
  }

  public toggleInvincibleWorldMode(active: boolean): void {
    this.worldConfig.isInvincibleMode = active
  }

  /**
   * PreloadedDataの作成に必要な情報を返す
   */
  public getPreloadedDataIngredients(): PreloadedDataIngredients {
    const ingredients = {
      players: this.players,
      megaphoneUsers: this.megaphoneUsers,
      mapName: this.mapManager.currentMap.mapName,
      worldConfig: this.worldConfig,
    }
    return ingredients
  }

  /**
   * CheckConnectで送信するデータの作成に必要な情報を返す
   */
  public getCheckConnectIngredients(): string[] {
    return this.players.getAllId()
  }

  /**
   * メインループの実行のたびに呼ばれる
   * @param dt 前回updateが呼ばれた時間と現在時間の差分
   */
  public update(dt: number): void {
    // player
    movePlayers(dt, this.players)

    // shark
    // サメを微小時間分移動
    moveSharks(dt, this.sharks, this.mapManager.currentMap)
    // サメとプレイヤーの衝突判定
    detectEntityOverlap(this.sharks, this.players, this.sharkHitPlayer.bind(this))
    // プレイヤーと衝突した or 消滅時間に達した or ワールド外に出た サメを削除
    removeDieShark(this.sharks, (sharkId: string) => {
      this.emitter.emitHitShark(sharkId)
    })

    // bomb
    // 爆発時間に達しているかチェック、爆発している爆弾は当たり判定をOnに
    checkExplode(this.bombs)
    // 爆弾とプレイヤーの衝突判定
    detectEntityOverlap(this.bombs, this.players, this.bombHitPlayer.bind(this))
    // 爆発時間に達している爆弾を削除
    removeExplodedBomb(this.bombs)
  }

  private sharkHitPlayer(sharkId: string, shark: Shark, playerId: string, player: Player): void {
    // サメを発射したプレイヤー自身との衝突は無視
    if (shark.ownerId === playerId) return

    if (player.isDead) return

    // プレイヤーと衝突したサメは消える
    shark.isDead = true

    this.damagePlayer(shark.ownerId, playerId, 'shark', shark.power)
  }

  private bombHitPlayer(bombId: string, bomb: Bomb, playerId: string, player: Player): void {
    // 爆弾を設置したプレイヤー自身との衝突は無視
    if (bomb.ownerId === playerId) return

    if (player.isDead) return

    this.damagePlayer(bomb.ownerId, playerId, 'bomb', bomb.power)
  }
}
