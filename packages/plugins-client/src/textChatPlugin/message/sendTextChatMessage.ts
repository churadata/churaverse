import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface SendTextChatData extends SendableObject {
  playerId: string
  message: string
}

export class SendTextChatMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SendTextChatData) {
    super('sendTextChatMessage', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    sendTextChatMessage: SendTextChatMessage
  }
}
