import type { TextChatService } from '../service/textChatService'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    textChatPlugin: TextChatPluginStore
  }
}
export interface TextChatPluginStore {
  readonly textChatService: TextChatService
  unreadCount: number
}
