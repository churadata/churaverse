import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface PlayerInvincibleTimeData extends SendableObject {
  playerId: string
  invincibleTime: number
}

export class PlayerInvincibleTimeMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerInvincibleTimeData) {
    super('playerInvincibleTime', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    playerInvincibleTime: PlayerInvincibleTimeMessage
  }
}
