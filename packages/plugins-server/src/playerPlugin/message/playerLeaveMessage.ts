import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface PlayerLeaveData extends SendableObject {
  playerId: string
}

export class PlayerLeaveMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PlayerLeaveData) {
    super('playerLeave', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    playerLeave: PlayerLeaveMessage
  }
}
