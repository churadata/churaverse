import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface PlayerDieData extends SendableObject {
  targetId: string
}

export class PlayerDieMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerDieData) {
    super('playerDie', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    playerDie: PlayerDieMessage
  }
}
