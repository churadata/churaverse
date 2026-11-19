import type { IMainScene, Store } from 'churaverse-engine-server'
import { BlackHoleRepository } from '../repository/blackHoleRepository'
import type { BlackHolePluginStore } from './defBlackHolePluginStore'
import '@churaverse/map-plugin-server'

export function initBlackHolePluginStore(store: Store<IMainScene>): void {
  const blackHolePluginStore: BlackHolePluginStore = {
    blackHoles: new BlackHoleRepository(store.of('mapPlugin').mapManager.currentMap),
  }

  store.setInit('churarenBlackHolePlugin', blackHolePluginStore)
}
