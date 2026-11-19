import type { MapPluginStore } from '@churaverse/map-plugin-server'
import type { IMainScene, Store } from 'churaverse-engine-server'
import { BombRepository } from '../repository/bombRepository'
import type { BombPluginStore } from './defBombPluginStore'

export function initBombPluginStore(store: Store<IMainScene>): void {
  const mapPluginStore: MapPluginStore = store.of('mapPlugin')
  const bombPluginStore: BombPluginStore = {
    bombs: new BombRepository(mapPluginStore.mapManager.currentMap),
  }

  store.setInit('bombPlugin', bombPluginStore)
}
