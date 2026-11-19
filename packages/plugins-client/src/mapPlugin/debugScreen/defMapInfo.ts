import type { DebugDetailScreenSection } from '@churaverse/debug-screen-plugin-client'

declare module '@churaverse/debug-screen-plugin-client' {
  export interface DebugDetailScreenSettingSectionMap {
    mapInfo: DebugDetailScreenSection
  }
}

declare module '@churaverse/debug-screen-plugin-client' {
  export interface DebugScreenSettingSectionMap {
    worldInfo: DebugDetailScreenSection
  }
}

declare module '@churaverse/debug-screen-plugin-client' {
  interface DumpDataMap {
    collisionCount: string
    spawnCount: string
    worldName: string
    worldSize: string
  }
}
