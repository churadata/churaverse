import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { Direction, IMainScene } from 'churaverse-engine-server'

export interface PlayerTurnData extends SendableObject {
  direction: Direction
}

export class PlayerTurnMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerTurnData) {
    super('playerTurn', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    playerTurn: PlayerTurnMessage
  }
}
