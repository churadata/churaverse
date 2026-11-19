import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-client'
import type { Direction, IMainScene } from 'churaverse-engine-client'

export interface PlayerTurnData extends SendableObject {
  direction: Direction
}

export class PlayerTurnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerTurnData) {
    super('playerTurn', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    playerTurn: PlayerTurnMessage
  }
}
