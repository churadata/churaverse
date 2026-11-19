import type { SendableObject } from '@churaverse/network-plugin-client'
import { BaseMessage } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface PlayerHealData extends SendableObject {
  playerId: string
  healAmount: number
}

export class PlayerHealMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerHealData) {
    super('playerHeal', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    playerHeal: PlayerHealMessage
  }
}
