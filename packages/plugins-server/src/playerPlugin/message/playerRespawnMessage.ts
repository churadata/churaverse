import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { Direction, IMainScene, Vector } from 'churaverse-engine-server'

export interface PlayerRespawnData extends SendableObject {
  playerId: string
  position: Vector & SendableObject
  direction: Direction
}

export class PlayerRespawnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerRespawnData) {
    super('playerRespawn', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    playerRespawn: PlayerRespawnMessage
  }
}
