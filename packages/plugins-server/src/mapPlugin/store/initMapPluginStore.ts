import type { IMainScene, Store } from 'churaverse-engine-server'
import type { MapManager } from '../mapManager'
import type { MapPluginStore } from './defMapPluginStore'

export function initMapPluginStore(store: Store<IMainScene>, mapManager: MapManager): void {
  const mapPluginStore: MapPluginStore = {
    mapManager,
  }

  store.setInit('mapPlugin', mapPluginStore)
}
