import type { DebugDetailScreenSection } from '@churaverse/debug-screen-plugin-client'

declare module '@churaverse/debug-screen-plugin-client' {
  export interface DebugDetailScreenSettingSectionMap {
    voiceChatInfo: DebugDetailScreenSection
  }
}

declare module '@churaverse/debug-screen-plugin-client' {
  interface DumpDataMap {
    microphoneIsOn: string
    megaphoneIsOn: string
  }
}
