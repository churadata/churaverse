import { CVEvent, type IMainScene } from 'churaverse-engine-server'
import type { TextChat } from '../model/textChat'

export class SendTextChatEvent extends CVEvent<IMainScene> {
  public constructor(public readonly textChat: TextChat) {
    super('sendTextChat', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    sendTextChat: SendTextChatEvent
  }
}
