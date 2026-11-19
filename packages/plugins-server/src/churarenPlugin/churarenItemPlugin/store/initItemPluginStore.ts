import type { IMainScene, Store } from 'churaverse-engine-server'
import { ItemRepository } from '../repository/itemRepository'
import type { ItemPluginStore } from './defItemPluginStore'
import '@churaverse/map-plugin-server'
import { AlchemyItemManager } from '../alchemyItemManager'

export function initItemPluginStore(store: Store<IMainScene>): void {
  const alchemyItemManager = new AlchemyItemManager()
  const itemPluginStore: ItemPluginStore = {
    items: new ItemRepository(store.of('mapPlugin').mapManager.currentMap),
    alchemyItemManager,
    alchemyItemRegister: alchemyItemManager,
  }

  store.setInit('churarenItemPlugin', itemPluginStore)
}

export function resetItemPluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('churarenItemPlugin')
}
