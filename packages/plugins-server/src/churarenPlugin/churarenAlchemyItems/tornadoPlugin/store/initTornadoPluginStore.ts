import type { IMainScene, Store } from 'churaverse-engine-server'
import { TornadoRepository } from '../repository/tornadoRepository'
import type { TornadoPluginStore } from './defTornadoPluginStore'
import '@churaverse/map-plugin-server'

export function initTornadoPluginStore(store: Store<IMainScene>): void {
  const tornadoPluginStore: TornadoPluginStore = {
    tornados: new TornadoRepository(store.of('mapPlugin').mapManager.currentMap),
  }

  store.setInit('tornadoPlugin', tornadoPluginStore)
}
