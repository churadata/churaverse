import type { DebugDetailScreenSection } from '@churaverse/debug-screen-plugin-client'

declare module '@churaverse/debug-screen-plugin-client' {
  export interface DebugDetailScreenSettingSectionMap {
    bombInfo: DebugDetailScreenSection
  }
}

declare module '@churaverse/debug-screen-plugin-client' {
  interface DumpDataMap {
    bombCount: string
  }
}
