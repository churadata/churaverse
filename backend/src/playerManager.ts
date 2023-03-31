import { LinearQuadTreeSpace, Rectangle } from './collisionDetection'
import { DirectionName } from './database'
import { MapManager } from './map'
import OutputDataQueue from './queueData'

interface EmitDieInfo {
  id: string
}

interface EmitRespawnInfo {
  id: string
  respawnPos: { x: number; y: number; direction: DirectionName }
}

export interface PlayerInfo extends Rectangle {
  x: number
  y: number
  xSpeed: number
  ySpeed: number
  direction: DirectionName
  playerId: string
  animState: string
  heroIsWalking: boolean
  heroColor: string
  heroName: string
  width: 34
  height: 40
  hp: 100
  isDead: boolean
}

export type Players = Map<string, PlayerInfo>

export class PlayerManager {
  static readonly DEFAULT_HP = 100
  static readonly START_POSITION = { x: 800, y: 440 } as const
  static readonly START_DIRECTION = 'down'

  static readonly WIDTH = 34
  static readonly HEIGHT = 40

  public allPlayerInfos: Players = new Map<string, PlayerInfo>()
  public qtree = new LinearQuadTreeSpace()

  private beforeUpdateTime: number = Date.now()

  private readonly mapManager: MapManager

  constructor(mapManager: MapManager) {
    this.mapManager = mapManager
  }

  public update(now: number): void {
    const dt = now - this.beforeUpdateTime
    this.beforeUpdateTime = now
    this.allPlayerInfos.forEach((playerInfo, playerId) => {
      if (playerInfo.xSpeed !== 0 || playerInfo.ySpeed !== 0) {
        playerInfo.x += playerInfo.xSpeed * dt
        playerInfo.y += playerInfo.ySpeed * dt

        this.qtree.updateActor(playerInfo, playerId)
      }
    })
  }

  public decreaseHp(playerId: string, damage: number): void {
    if (damage < 0) {
      console.log('damageが0未満')
    }

    const player = this.allPlayerInfos.get(playerId)
    if (player !== undefined) {
      player.hp -= damage

      if (player.hp <= 0) {
        const RESPAWN_TIME = 5000
        player.isDead = true
        this.emitDieInfo(playerId)

        setTimeout(this.respawn, RESPAWN_TIME, this, playerId)
      }
    }
  }

  private respawn(self: PlayerManager, playerId: string): void {
    const player = self.allPlayerInfos.get(playerId)
    if (player !== undefined) {
      const spawnPos = self.mapManager.getRandomPos()
      player.x = spawnPos.x
      player.y = spawnPos.y
      player.direction = PlayerManager.START_DIRECTION
      player.hp = PlayerManager.DEFAULT_HP
      player.xSpeed = 0
      player.ySpeed = 0
      player.isDead = false
      self.emitRespawnInfo(playerId)
      self.qtree.updateActor(player, playerId)
    }
  }

  public emitDieInfo(playerId: string): void {
    const dieInfo: EmitDieInfo = {
      id: playerId,
    }

    OutputDataQueue.insertExcludeTransmitQueue(
      [{ type: 'otherPlayerDie', info: dieInfo }],
      [playerId]
    )
    OutputDataQueue.insertOneTransmitQueue(
      [{ type: 'ownPlayerDie', info: dieInfo }],
      playerId
    )
  }

  public emitRespawnInfo(playerId: string): void {
    const player = this.allPlayerInfos.get(playerId)
    if (player === undefined) {
      return
    }
    const respawnInfo: EmitRespawnInfo = {
      id: playerId,
      respawnPos: {
        x: player.x,
        y: player.y,
        direction: player.direction,
      },
    }

    OutputDataQueue.insertExcludeTransmitQueue(
      [{ type: 'otherPlayerRespawn', info: respawnInfo }],
      [playerId]
    )
    OutputDataQueue.insertOneTransmitQueue(
      [{ type: 'ownPlayerRespawn', info: respawnInfo }],
      playerId
    )
  }
}
