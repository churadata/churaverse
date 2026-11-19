import type { IMainScene, Store } from 'churaverse-engine-server'
import { SharkRepository } from '../repository/sharkRepository'
import type { SharkPluginStore } from './defSharkPluginStore'

export function initSharkPluginStore(store: Store<IMainScene>): void {
  const sharkPluginStore: SharkPluginStore = {
    sharks: new SharkRepository(store.of('mapPlugin').mapManager.currentMap),
  }

  store.setInit('sharkPlugin', sharkPluginStore)
}
