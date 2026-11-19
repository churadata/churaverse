import type { IMainScene, Store } from 'churaverse-engine-server'
import { WaterRingRepository } from '../repository/waterRingRepository'
import type { WaterRingPluginStore } from './defWaterRingPluginStore'
import '@churaverse/map-plugin-server'

export function initWaterRingPluginStore(store: Store<IMainScene>): void {
  const waterRingPluginStore: WaterRingPluginStore = {
    waterRings: new WaterRingRepository(store.of('mapPlugin').mapManager.currentMap),
  }

  store.setInit('waterRingPlugin', waterRingPluginStore)
}
