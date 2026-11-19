import type { DebugSummaryScreenSection } from '@churaverse/debug-screen-plugin-client'

declare module '@churaverse/debug-screen-plugin-client' {
  export interface DebugScreenSettingSectionMap {
    playerInfo: DebugSummaryScreenSection
  }
}

declare module '@churaverse/debug-screen-plugin-client' {
  interface DumpDataMap {
    playerId: string
    playerName: string
    playerColor: string
    playerHp: string
    playerPosition: string
    playerDirection: string
    playerRole: string
  }
}
