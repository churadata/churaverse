import type { IMainScene, Store } from 'churaverse-engine-client'
import type { PlayerVoiceChatIcons } from '../ui/playerVoiceChatIcons'
import type { VoiceChatPluginStore } from './defVoiceChatPluginStore'

export function initVoiceChatPluginStore(store: Store<IMainScene>): void {
  const voiceChatPluginStore: VoiceChatPluginStore = {
    playerVoiceChatUis: new Map<string, PlayerVoiceChatIcons>(),
  }

  store.setInit('voiceChatPlugin', voiceChatPluginStore)
}
