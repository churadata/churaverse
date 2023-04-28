import { GRID_SIZE } from '../domain/worldConfig'
import { Direction } from '../domain/direction'
import { IBadge } from '../domain/IRender/IBadge'
import { IBombRender } from '../domain/IRender/IBombRender'
import { IChatBoardRender } from '../domain/IRender/IChatBoardRender'
import { IChatInputRender } from '../domain/IRender/IChatInputRender'
import { IDialog } from '../domain/IRender/IDialog'
import { IMapRender } from '../domain/IRender/IMapRender'
import { IPlayerRender } from '../domain/IRender/IPlayerRender'
import { IServerErrorRender } from '../domain/IRender/IServerErrorRender'
import { ISharkRender } from '../domain/IRender/ISharkRender'
import { Bomb } from '../domain/model/bomb'
import { GRID_WALK_DURATION_MS, Player } from '../domain/model/player'
import { Shark, SHARK_SPEED, SHARK_WALK_LIMIT_GRIDS } from '../domain/model/shark'
import { TextChat } from '../domain/model/textChat'
import { PlayerColorName } from '../domain/model/types'
import { Position } from '../domain/position'
import { BombService } from '../domain/service/bombService'
import { PlayersService } from '../domain/service/playersService'
import { SharkService } from '../domain/service/sharkService'
import { TextChatService } from '../domain/service/textChatService'
import { IPlayerSetupInfoWriter } from './IPlayerSetupInfoWriter'
import { ISocketEmitter } from './ISocketEmitter'
import { ITextFieldObserver } from './ITextFieldObserver'
import { ILocalDevice } from './ILocalDeviceManager/ILocalDevice'
import { Microphone } from '../domain/model/localDevice/microphone'
import { Camera } from '../domain/model/localDevice/camera'
import { Speaker } from '../domain/model/localDevice/speaker'
import { IMicSelector } from './ILocalDeviceSelector/IMicSelector'
import { ISpeakerSelector } from './ILocalDeviceSelector/ISpeakerSelector'
import { ICameraSelector } from './ILocalDeviceSelector/ICameraSelector'

/**
 * Interactor
 * イベント駆動の中心地
 * ロジックは基本ここかdomainに書かれる
 * イベントは呼び出しによって発火する
 * 入力は関数の引数
 * 出力はDIされたRenderやEmitter(もしくは返り値)
 */
export class Interactor {
  /** serverからエラーを受け取ったか */
  private isReceivedError = false

  public constructor(
    private readonly ownPlayerId: string,
    private readonly emitter: ISocketEmitter,
    private readonly mapRender: IMapRender,
    private readonly textFieldObserver: ITextFieldObserver,
    private readonly chatBoardRender: IChatBoardRender,
    private readonly chatInputRender: IChatInputRender,
    private readonly chatBadge: IBadge,
    private readonly chatDialog: IDialog,
    private readonly localDevice: ILocalDevice,
    private readonly micSelector: IMicSelector,
    private readonly speakerSelector: ISpeakerSelector,
    private readonly cameraSelector: ICameraSelector,
    private readonly playerSetupInfoWriter: IPlayerSetupInfoWriter,
    player: Player,
    playerRender: IPlayerRender
  ) {
    // Playerに焦点を当てる
    playerRender.focus()
    this.players.join(this.ownPlayerId, player)
    this.playerRenders.set(this.ownPlayerId, playerRender)

    // serverにjoinの通知
    emitter.join(player, this.ownPlayerId)
    // serverに既存プレイヤーの要求
    void emitter.requestPreloadedData().then((list) => {
      list.forEach(([id, player, playerRender]) => {
        if (this.ownPlayerId === id) {
          // 自分のspriteだった場合だけ,
          // 捨てる
          playerRender.destroy()
        } else {
          this.players.join(id, player)
          this.playerRenders.set(id, playerRender)
        }
      })
    })
  }

  public players = new PlayersService()
  public playerRenders = new Map<string, IPlayerRender>()
  public shark = new SharkService()
  public sharkRenders = new Map<string, ISharkRender>()
  public bombs = new BombService()
  public bombRenders = new Map<string, IBombRender>()

  public textChat = new TextChatService()
  public joinPlayer(id: string, player: Player, render: IPlayerRender): void {
    this.players.join(id, player)
    this.playerRenders.set(id, render)
  }

  public leavePlayer(id: string): void {
    this.players.leave(id)
    this.playerRenders.get(id)?.destroy()
    this.playerRenders.delete(id)
  }

  public turnPlayer(id: string, direction: Direction): void {
    if (this.isPlayerDead(id)) return

    this.players.turn(id, direction)

    this.playerRenders.get(id)?.turn(direction)

    if (this.ownPlayerId === id && !this.isReceivedError) {
      this.emitter.turnPlayer(direction)
    }
  }

  public walkPlayer(id: string, direction: Direction, speed?: number, source?: Position): void {
    if (this.isPlayerDead(id)) return
    if (this.textFieldObserver.isTextInputting) return

    const player = this.players.getPlayer(id)

    if (player === undefined) {
      return
    }

    // 自プレイヤーの場合は歩行の上書きは行わない
    if (this.ownPlayerId === id && player.isWalking) return

    // 向きが違う場合は合わせるように
    if (player.direction !== direction) {
      this.turnPlayer(id, direction)
    }

    // speedがundefinedの場合はデフォルトの値を代入
    speed ??= GRID_SIZE / GRID_WALK_DURATION_MS

    const startPos = player.position.copy()

    // 開始位置と実際のプレイヤーの位置がこの値を超えた場合は移動前にteleportで補正
    const limitToIgnoreCorrection = 40

    // 一方向に一定以上ずれている時とｘｙの両方向ずれている場合は瞬間移動して補正
    // この条件式に当てはまらない場合は加速して補正される
    if (
      source !== undefined &&
      (player.position.distanceTo(source) >= limitToIgnoreCorrection ||
        (source?.x !== player.position.x && source?.y !== player.position.y))
    ) {
      player.teleport(source)
      this.playerRenders.get(id)?.teleport(source)
    }

    const dest = player.position.copy()
    dest.gridX += direction.x
    dest.gridY += direction.y

    // 移動先が通行不可マスの場合は移動しない
    if (this.mapRender.hasBlockingTile(dest)) return

    if (this.ownPlayerId === id && !this.isReceivedError) {
      // 移動開始時の座標をemitする必要がある
      this.emitter.walkPlayer(startPos, direction, speed)
    }

    const playerRender = this.playerRenders.get(id)
    if (playerRender !== undefined) {
      // tweenのonUpdateより先にkeyboardControllerの次のupdateが呼ばれてしまうため
      // 前もってplayer.IsWalkingをtrueにする
      player.startWalk()
      playerRender.walk(
        dest,
        direction,
        speed,
        (pos) => {
          player.walk(pos, direction)
        },
        () => {
          player.stop()
          if (this.ownPlayerId === id && !this.isReceivedError) {
            this.emitter.stopPlayer(player.position, player.direction)
          }
        }
      )
    } else {
      // renderが存在しなくても動く方法
      player.walk(dest, direction)
    }
  }

  public stopPlayer(id: string): void {
    const player = this.players.getPlayer(id)
    player?.stop()
    this.playerRenders.get(id)?.stop()
  }

  public damagePlayer(id: string, amount: number): void {
    this.players.damage(id, amount)
    this.playerRenders.get(id)?.damage(amount)
  }

  public changePlayerName(id: string, name: string): void {
    this.players.changePlayerName(id, name)
    this.playerRenders.get(id)?.applyPlayerName(name)

    if (this.ownPlayerId === id && !this.isReceivedError) {
      const player = this.players.getPlayer(id)
      if (player === undefined) {
        return
      }

      this.emitter.updatePlayerProfile(name, player.color)
    }
  }

  public changePlayerColor(id: string, color: PlayerColorName): void {
    this.players.changePlayerColor(id, color)
    this.playerRenders.get(id)?.applyPlayerColor(color)

    if (this.ownPlayerId === id && !this.isReceivedError) {
      const player = this.players.getPlayer(id)
      if (player === undefined) {
        return
      }

      this.emitter.updatePlayerProfile(player.name, color)
    }
  }

  public diePlayer(id: string): void {
    this.stopPlayer(id)
    this.playerRenders.get(id)?.dead()
  }

  public respawnPlayer(id: string, position: Position): void {
    this.players.respawn(id, position)
    this.playerRenders.get(id)?.respawn(position)
  }

  public isPlayerDead(id: string): boolean {
    return this.players.isDead(id)
  }

  public savePlayerInfo(): void {
    const ownPlayer = this.players.getPlayer(this.ownPlayerId)
    if (ownPlayer === undefined) {
      return
    }
    this.playerSetupInfoWriter.save(ownPlayer.name, ownPlayer.color)
  }

  public spawnShark(
    id: string,
    playerId: string,
    render: ISharkRender,
    position?: Position,
    direction?: Direction,
    spawnTime?: number
  ): void {
    const source = this.players.getPlayer(playerId)
    if (source === undefined) {
      return
    }
    // 自プレイヤーの位置からgap分だけ前にずらしてサメを出す
    // 他プレイヤーの場合は、サメの位置をそのまま受信しているためgap分ずらす必要がないので0
    const gap = position !== undefined && direction !== undefined ? 0 : 65
    const startPos = source.position.copy()
    // positionがない場合は、自プレイヤーのサメのポジション
    position ??= new Position(startPos.x + gap * source.direction.x, startPos.y + gap * source.direction.y)
    // directionがない場合は、自プレイヤーのサメの方向
    direction ??= source.direction
    spawnTime ??= Date.now()
    const daley = Date.now() - spawnTime
    // 受信時のサメの出現位置を補正
    position.x += SHARK_SPEED * daley * direction.x
    position.y += SHARK_SPEED * daley * direction.y
    const shark = new Shark(source, position, direction, spawnTime)
    this.shark.spawn(id, shark)
    this.sharkRenders.set(id, render)

    if (playerId === this.ownPlayerId && !this.isReceivedError) {
      this.emitter.spawnShark(id, position, direction)
    }

    // spawnしたら動き出す
    this.walkShark(shark, render, daley)
  }

  public walkShark(shark: Shark, render: ISharkRender, daley: number): void {
    const dest = shark.position.copy()
    dest.x = shark.direction.x * SHARK_WALK_LIMIT_GRIDS * GRID_SIZE + shark.position.x
    dest.y = shark.direction.y * SHARK_WALK_LIMIT_GRIDS * GRID_SIZE + shark.position.y

    render.walk(shark.position, dest, shark.direction, daley, (pos) => {
      shark.walk(pos)
    })
  }

  public dieShark(id: string): void {
    this.shark.die(id)
    this.sharkRenders.get(id)?.dead()
  }

  public dropBomb(bombId: string, playerId: string, render: IBombRender, position?: Position): void {
    const source = this.players.getPlayer(playerId)
    if (source === undefined) {
      return
    }
    // positionがない場合は、自プレイヤーの位置
    position ??= source.position.copy()

    const bomb = new Bomb(source, position)

    this.bombRenders.set(bombId, render)
    this.bombs.drop(bombId, bomb)

    if (this.ownPlayerId === playerId && !this.isReceivedError) {
      this.emitter.spawnBomb(bombId, position)
    }

    render.drop(position)

    setTimeout(() => {
      render.explode()
      this.bombRenders.delete(bombId)
      this.bombs.explode(bombId)
    }, bomb.timeLimit)
  }

  public addTextChat(name: string, message: string): void {
    const textChat = new TextChat(name, message)
    this.textChat.addChat(textChat)
    this.chatBoardRender.add(textChat)
    if (!this.chatDialog.isOpen) {
      this.chatBadge.activate()
    }
  }

  /**
   * serverからErrorを受け取った時
   */
  public receiveServerError(render: IServerErrorRender): void {
    this.isReceivedError = true
    render.show()
  }

  public isTextInputting(): boolean {
    return this.textFieldObserver.isTextInputting
  }

  /**
   * actionをまとめて送信させる
   */
  public flushActions(): void {
    if (this.isReceivedError) {
      return
    }
    this.emitter.flushActions()
  }

  /**
   * メッセージを送信する。
   * 空文字のときには送信できない。
   */
  public sendChat(playerId: string, message: string): void {
    if (message !== '') {
      this.emitter.chat(this.players.getPlayerName(playerId) ?? 'name', message)
      this.emitter.flushActions()
    }
    this.chatInputRender.clearMessage()
  }

  /**
   * textChatRenderから入力欄の文字列を取得する。
   */
  public getMessage(): string {
    return this.chatInputRender.getMessage()
  }

  /**
   * 接続するマイクを変更する
   */
  public switchMicrophone(mic: Microphone): void {
    this.localDevice.microphoneManager.switchMicrophone(mic)
  }

  /**
   * 接続するカメラを変更する
   */
  public switchCamera(camera: Camera): void {
    this.localDevice.cameraManager.switchCamera(camera)
  }

  /**
   * 接続するスピーカーを変更する
   */
  public switchSpeaker(speaker: Speaker): void {
    this.localDevice.speakerManager.switchSpeaker(speaker)
  }

  /**
   * 接続機器に変更があった場合に実行する処理
   */
  public async deviceChange(): Promise<void> {
    this.micSelector.updateLocalMicrophones(await this.localDevice.microphoneManager.getMicrophones())
    this.speakerSelector.updateLocalSpeakers(await this.localDevice.speakerManager.getSpeakers())
    this.cameraSelector.updateLocalCameras(await this.localDevice.cameraManager.getCameras())
  }
}
