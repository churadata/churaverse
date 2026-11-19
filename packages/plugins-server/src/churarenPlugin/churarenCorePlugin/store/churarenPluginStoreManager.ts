import type { GameIds } from '@churaverse/game-plugin-server'
import type { IEventBus, IMainScene, Store } from 'churaverse-engine-server'
import { ChurarenGameSequence } from '../logic/churarenGameSequence'
import type { ChurarenPluginStore } from './defChurarenPluginStore'

/**
 * churarenPluginStoreを初期化する関数
 */
export function initChurarenPluginStore(
  gameId: GameIds,
  store: Store<IMainScene>,
  eventBus: IEventBus<IMainScene>
): void {
  const churarenPluginStore: ChurarenPluginStore = {
    churarenGameSequence: new ChurarenGameSequence(gameId, store, eventBus),
  }

  store.setInit('churarenPlugin', churarenPluginStore)
}
