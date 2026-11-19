import type { PlayersMegaphoneRepository } from '../repository/playersMegaphoneRepository'
import type { PlayersMicRepository } from '../repository/playersMicRepository'

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    voiceChatPlugin: VoiceChatPluginStore
  }
}

export interface VoiceChatPluginStore {
  readonly playersMic: PlayersMicRepository
  readonly playersMegaphone: PlayersMegaphoneRepository
}
