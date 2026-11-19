import type { IMainScene, Store } from 'churaverse-engine-client'
import { TextChatService } from '../service/textChatService'
import type { TextChatPluginStore } from './defTextChatPluginStore'

export function initTextChatPluginStore(store: Store<IMainScene>): void {
  const pluginStore: TextChatPluginStore = {
    textChatService: new TextChatService(),
    unreadCount: 0,
  }
  store.setInit('textChatPlugin', pluginStore)
}
