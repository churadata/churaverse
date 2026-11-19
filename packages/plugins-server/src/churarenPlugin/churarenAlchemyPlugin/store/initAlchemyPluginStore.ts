import type { IMainScene, Store } from 'churaverse-engine-server'
import type { AlchemyPluginStore } from './defAlchemyPluginStore'
import '@churaverse/map-plugin-server'
import { AlchemyPotRepository } from '../repository/alchemyPotRepository'

export function initAlchemyPluginStore(store: Store<IMainScene>): void {
  const alchemyPluginStore: AlchemyPluginStore = {
    alchemyPots: new AlchemyPotRepository(store.of('mapPlugin').mapManager.currentMap),
  }
  store.setInit('alchemyPlugin', alchemyPluginStore)
}

export function resetAlchemyPluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('alchemyPlugin')
}
