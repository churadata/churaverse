import type { IMainScene, Store } from 'churaverse-engine-server'
import { PlayerAlchemyItemRepository } from '../repository/playerAlchemyItemRepository'
import { PlayerMaterialItemRepository } from '../repository/playerMaterialItemRepository'
import type { PlayerItemsStore } from './defPlayerItemsStore'

export function initPlayerItemStore(store: Store<IMainScene>): void {
  const playerItemsStore: PlayerItemsStore = {
    materialItems: new PlayerMaterialItemRepository(),
    alchemyItem: new PlayerAlchemyItemRepository(),
  }

  store.setInit('playerItemStore', playerItemsStore)
}

export function resetPlayerItemStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('playerItemStore')
}
