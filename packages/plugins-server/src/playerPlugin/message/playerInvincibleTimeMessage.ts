import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface PlayerInvincibleTimeData extends SendableObject {
  playerId: string
  invincibleTime: number
}

export class PlayerInvincibleTimeMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerInvincibleTimeData) {
    super('playerInvincibleTime', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    playerInvincibleTime: PlayerInvincibleTimeMessage
  }
}
