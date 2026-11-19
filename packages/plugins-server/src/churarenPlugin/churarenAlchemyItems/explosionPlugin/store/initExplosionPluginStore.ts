import type { IMainScene, Store } from 'churaverse-engine-server'
import { ExplosionRepository } from '../repository/explosionRepository'
import type { ExplosionPluginStore } from './defExplosionPluginStore'
import '@churaverse/map-plugin-server'

export function initExplosionPluginStore(store: Store<IMainScene>): void {
  const explosionPluginStore: ExplosionPluginStore = {
    explosions: new ExplosionRepository(store.of('mapPlugin').mapManager.currentMap),
  }

  store.setInit('explosionPlugin', explosionPluginStore)
}
