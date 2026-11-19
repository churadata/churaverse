import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface PlayerDieData extends SendableObject {
  targetId: string
}

export class PlayerDieMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerDieData) {
    super('playerDie', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    playerDie: PlayerDieMessage
  }
}
