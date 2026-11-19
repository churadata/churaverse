import type { SendableObject } from '@churaverse/network-plugin-server'
import { BaseMessage } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface PlayerHealData extends SendableObject {
  playerId: string
  healAmount: number
}

export class PlayerHealMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerHealData) {
    super('playerHeal', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    playerHeal: PlayerHealMessage
  }
}
