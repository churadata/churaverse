import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { Direction, IMainScene, Vector } from 'churaverse-engine-server'
import type { PlayerColor } from '../types/playerColor'
import type { PlayerRole } from '../types/playerRole'

export interface PlayerJoinData extends SendableObject {
  hp: number
  position: Vector & SendableObject
  direction: Direction
  playerId: string
  heroColor: PlayerColor
  heroName: string
  role: PlayerRole
  spawnTime: number
}

export class PlayerJoinMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerJoinData) {
    super('playerJoin', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    playerJoin: PlayerJoinMessage
  }
}
