import type { PlayerVoiceChatIcons } from '../ui/playerVoiceChatIcons'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    voiceChatPlugin: VoiceChatPluginStore
  }
}

export interface VoiceChatPluginStore {
  readonly playerVoiceChatUis: Map<string, PlayerVoiceChatIcons>
}
