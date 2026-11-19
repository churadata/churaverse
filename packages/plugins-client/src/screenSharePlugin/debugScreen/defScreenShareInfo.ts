import type { DebugDetailScreenSection } from '@churaverse/debug-screen-plugin-client'

declare module '@churaverse/debug-screen-plugin-client' {
  export interface DebugDetailScreenSettingSectionMap {
    screenShareInfo: DebugDetailScreenSection
  }
}

declare module '@churaverse/debug-screen-plugin-client' {
  interface DumpDataMap {
    screenShareIsOn: string
    screenShareId: string
  }
}
