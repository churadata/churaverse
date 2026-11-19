import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { Direction, IMainScene, Vector } from 'churaverse-engine-server'

export interface PlayerStopData extends SendableObject {
  stopPos: Vector & SendableObject
  direction: Direction
}

export class PlayerStopMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerStopData) {
    super('playerStop', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    playerStop: PlayerStopMessage
  }
}
