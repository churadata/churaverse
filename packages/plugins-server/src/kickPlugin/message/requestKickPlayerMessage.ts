import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface RequestKickPlayerData extends SendableObject {
  kickedId: string
  kickerId: string
}

export class RequestKickPlayerMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: RequestKickPlayerData) {
    super('requestKickPlayer', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    requestKickPlayer: RequestKickPlayerMessage
  }
}
