import { BaseMessage, type Sendable, type SendableObject } from '@churaverse/network-plugin-client'
import type { Direction, IMainScene, Vector } from 'churaverse-engine-client'
import type { PlayerColor } from '../types/playerColor'
import type { PlayerRole } from '../types/playerRole'

export interface PlayerJoinData extends SendableObject {
  hp: number
  position: Vector & Sendable
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

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    playerJoin: PlayerJoinMessage
  }
}
