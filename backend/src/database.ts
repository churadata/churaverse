import { BombInfo, BombManager } from './bombManager'
import { MapManager } from './map'
import { PlayerInfo, PlayerManager } from './playerManager'
import { ReceivedPacket } from './server'
import { SharkInfo, SharkManager } from './sharkManager'
import { Socket } from 'socket.io'
import { ErrorHandle } from './errorHandle'

export type DirectionName = 'up' | 'down' | 'left' | 'right' | ''

interface Vec {
  x: number
  y: number
}

type Direction = {
  [key in DirectionName]: Vec
}

export const VECTOR: Direction = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  '': { x: 0, y: 0 },
}

type WalkAnimName = 'walk_back' | 'walk_front' | 'walk_left' | 'walk_right' | ''
type WalkVector = {
  [key in WalkAnimName]: Vec
}
export const WALK_VECTOR: WalkVector = {
  walk_back: { x: 0, y: -1 },
  walk_front: { x: 0, y: 1 },
  walk_left: { x: -1, y: 0 },
  walk_right: { x: 1, y: 0 },
  '': { x: 0, y: 0 },
}

interface BaseReceivedAction {
  _delay: number
}

interface ReceivedSharkAction extends BaseReceivedAction {
  sharkId: string
  startPos: { x: number; y: number; direction: DirectionName }
}

interface ReceivedBombAction extends BaseReceivedAction {
  bombId: string
  position: { x: number; y: number }
}

class Database {
  mapManager: MapManager = new MapManager('Map.json')

  playerManager: PlayerManager = new PlayerManager(this.mapManager)
  sharkManager: SharkManager = new SharkManager()
  bombManager: BombManager = new BombManager()

  public addShark(
    playerId: string,
    emitTime: number,
    sharkInfo: ReceivedSharkAction
  ): void {
    const height =
      sharkInfo.startPos.direction === 'up' ||
      sharkInfo.startPos.direction === 'down'
        ? SharkManager.LONG_SIDE
        : SharkManager.SHORT_SIDE
    const width =
      height === SharkManager.LONG_SIDE
        ? SharkManager.SHORT_SIDE
        : SharkManager.LONG_SIDE
    const shark: SharkInfo = {
      playerId,
      startTime: emitTime - sharkInfo._delay,
      x: sharkInfo.startPos.x,
      y: sharkInfo.startPos.y,
      xSpeed: VECTOR[sharkInfo.startPos.direction].x * SharkManager.SPEED,
      ySpeed: VECTOR[sharkInfo.startPos.direction].y * SharkManager.SPEED,
      height,
      width,
    }
    this.sharkManager.allSharkInfos.set(sharkInfo.sharkId, shark)
    this.sharkManager.qtree.addActor(shark, sharkInfo.sharkId)
  }

  public removeShark(sharkId: string): void {
    this.sharkManager.allSharkInfos.delete(sharkId)
  }

  public addBomb(
    playerId: string,
    emitTime: number,
    bombInfo: ReceivedBombAction
  ): void {
    const bomb: BombInfo = {
      playerId,
      startTime: emitTime - bombInfo._delay,
      x: bombInfo.position.x,
      y: bombInfo.position.y,
      width: 80,
      height: 80,
    }
    this.bombManager.allBombInfos.set(bombInfo.bombId, bomb)
    this.bombManager.qtree.addActor(bomb, bombInfo.bombId)
  }

  public addPlayer(id: string): void {
    const player: PlayerInfo = {
      x: PlayerManager.START_POSITION.x,
      y: PlayerManager.START_POSITION.y,
      xSpeed: 0,
      ySpeed: 0,
      direction: PlayerManager.START_DIRECTION,
      playerId: id,
      animState: 'walk_front',
      heroIsWalking: false,
      heroColor: 'basic',
      heroName: 'name',
      width: 34,
      height: 40,
      hp: 100,
      isDead: false,
    }
    this.playerManager.allPlayerInfos.set(id, player)
    this.playerManager.qtree.addActor(player, id)
  }

  public removePlayer(id: string): void {
    if (this.playerManager.allPlayerInfos.get(id) !== undefined) {
      this.playerManager.allPlayerInfos.delete(id)
    }
    this.playerManager.qtree.removeActor(id)
  }

  public updateWhenReceivePacket(
    data: ReceivedPacket,
    socket: Socket,
    errorHandle: ErrorHandle
  ): void {
    const allPlayerInfos = this.playerManager.allPlayerInfos.get(data.id)
    if (allPlayerInfos !== undefined) {
      try {
        for (const actionData of data.actions) {
          switch (actionData.type) {
            case 'profile':
              allPlayerInfos.heroColor = actionData.infos[0].heroColor
              allPlayerInfos.heroName = actionData.infos[0].heroName
              break
            case 'walk': {
              allPlayerInfos.x = actionData.infos[0].startPos.x
              allPlayerInfos.y = actionData.infos[0].startPos.y
              allPlayerInfos.direction = actionData.infos[0].startPos.direction
              const animState: WalkAnimName = actionData.infos[0].animState
              allPlayerInfos.xSpeed =
                actionData.infos[0].walkSpeed * WALK_VECTOR[animState].x
              allPlayerInfos.ySpeed =
                actionData.infos[0].walkSpeed * WALK_VECTOR[animState].y
              break
            }
            case 'turn':
              allPlayerInfos.direction = actionData.infos[0].direction
              allPlayerInfos.xSpeed = 0
              allPlayerInfos.ySpeed = 0
              break
            case 'shark':
              for (const sharkInfo of actionData.infos) {
                this.addShark(data.id, data.emitTime, sharkInfo)
              }
              break
            case 'bomb':
              for (const bombInfo of actionData.infos) {
                this.addBomb(data.id, data.emitTime, bombInfo)
              }
              break
            default:
              break
          }
        }
      } catch (err: any) {
        errorHandle.showErrorLog(err, this.playerManager.allPlayerInfos)
        errorHandle.inviteReloadIfNoneExistedId(data, socket, this)
      }
    }
  }
}

export default Database
