import { BaseMessage, type Sendable, type SendableObject } from '@churaverse/network-plugin-client'
import type { Direction, IMainScene, Vector } from 'churaverse-engine-client'

export interface PlayerRespawnData extends SendableObject {
  playerId: string
  position: Vector & Sendable
  direction: Direction
}

export class PlayerRespawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerRespawnData) {
    super('playerRespawn', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    playerRespawn: PlayerRespawnMessage
  }
}
