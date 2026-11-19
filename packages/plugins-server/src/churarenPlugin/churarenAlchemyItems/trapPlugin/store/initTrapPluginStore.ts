import type { IMainScene, Store } from 'churaverse-engine-server'
import { TrapRepository } from '../repository/trapRepository'
import type { TrapPluginStore } from './defTrapPluginStore'
import '@churaverse/map-plugin-server'

export function initTrapPluginStore(store: Store<IMainScene>): void {
  const trapPluginStore: TrapPluginStore = {
    traps: new TrapRepository(store.of('mapPlugin').mapManager.currentMap),
  }

  store.setInit('trapPlugin', trapPluginStore)
}
