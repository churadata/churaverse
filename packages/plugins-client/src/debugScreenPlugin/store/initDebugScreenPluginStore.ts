import type { IEventBus, IMainScene, Store } from 'churaverse-engine-client'
import { DebugDetailScreenContainer } from '../debugScreen/debugDetailScreenContainer'
import { DebugSummaryScreenContainer } from '../debugScreen/debugSummaryScreenContainer'
import type { DebugScreenPluginStore } from './defDebugScreenPluginStore'

export function initDebugScreenPluginStore(store: Store<IMainScene>, eventBus: IEventBus<IMainScene>): void {
  const debugScreenPluginStore: DebugScreenPluginStore = {
    debugSummaryScreenContainer: new DebugSummaryScreenContainer(eventBus),
    debugDetailScreenContainer: new DebugDetailScreenContainer(),
  }

  store.setInit('debugScreenPlugin', debugScreenPluginStore)
}
