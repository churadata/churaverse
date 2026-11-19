import type { IMainScene, Store } from 'churaverse-engine-server'
import { FlamePillarRepository } from '../repository/flamePillarRepository'
import type { FlamePillarPluginStore } from './defFlamePillarPluginStore'
import '@churaverse/map-plugin-server'

export function initFlamePillarPluginStore(store: Store<IMainScene>): void {
  const flamePillarPluginStore: FlamePillarPluginStore = {
    flamePillars: new FlamePillarRepository(store.of('mapPlugin').mapManager.currentMap),
  }

  store.setInit('flamePillarPlugin', flamePillarPluginStore)
}
