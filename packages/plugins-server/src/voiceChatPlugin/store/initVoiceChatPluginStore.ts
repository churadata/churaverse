import type { IMainScene, Store } from 'churaverse-engine-server'
import { PlayersMegaphoneRepository } from '../repository/playersMegaphoneRepository'
import { PlayersMicRepository } from '../repository/playersMicRepository'
import type { VoiceChatPluginStore } from './defVoiceChatPluginStore'

export function initVoiceChatPluginStore(store: Store<IMainScene>): void {
  const voiceChatPluginStore: VoiceChatPluginStore = {
    playersMic: new PlayersMicRepository(),
    playersMegaphone: new PlayersMegaphoneRepository(),
  }

  store.setInit('voiceChatPlugin', voiceChatPluginStore)
}
