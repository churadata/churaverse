import { BaseMessage, type Sendable, type SendableObject } from '@churaverse/network-plugin-client'
import type { Direction, IMainScene, Vector } from 'churaverse-engine-client'

export interface PlayerStopData extends SendableObject {
  stopPos: Vector & Sendable
  direction: Direction
}

export class PlayerStopMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerStopData) {
    super('playerStop', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    playerStop: PlayerStopMessage
  }
}
