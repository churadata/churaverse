import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface PlayerLeaveData extends SendableObject {
  playerId: string
}

export class PlayerLeaveMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerLeaveData) {
    super('playerLeave', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    playerLeave: PlayerLeaveMessage
  }
}
