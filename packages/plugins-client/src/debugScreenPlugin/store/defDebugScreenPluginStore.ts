import type { DebugDetailScreenContainer } from '../debugScreen/debugDetailScreenContainer'
import type { DebugSummaryScreenContainer } from '../debugScreen/debugSummaryScreenContainer'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    debugScreenPlugin: DebugScreenPluginStore
  }
}

export interface DebugScreenPluginStore {
  readonly debugSummaryScreenContainer: DebugSummaryScreenContainer
  readonly debugDetailScreenContainer: DebugDetailScreenContainer
}
