import type { DebugSummaryScreenSection } from '../debugSummaryScreenSection'

declare module '../IDebugScreenContainer/IDebugSummaryScreenContainer' {
  export interface DebugScreenSettingSectionMap {
    worldInfo: DebugSummaryScreenSection
  }
}

declare module '../dataDumper' {
  interface DumpDataMap {
    fps: string
    frontendVersion: string
    backendVersion: string
    deployVersion: string
  }
}
