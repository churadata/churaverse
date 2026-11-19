import type { IAlchemyItemRenderer } from '@churaverse/churaren-alchemy-base-plugin-client'
import type { IItemRenderer } from '@churaverse/churaren-item-plugin-client'
import type { IMainScene, Store } from 'churaverse-engine-client'
import { PlayerAlchemyItemRepository } from '../repository/playerAlchemyItemRepository'
import { PlayerMaterialItemRepository } from '../repository/playerMaterialItemRepository'
import { AlchemyItemBoxContainer } from '../ui/alchemyItemBoxContainer/AlchemyItemBoxContainer'
import { MaterialItemBoxContainer } from '../ui/materialItemBoxContainer/MaterialItemBoxContainer'
import type { PlayerItemsStore } from './defPlayerItemsStore'

export function initPlayerItemStore(store: Store<IMainScene>): void {
  const playerItemStore: PlayerItemsStore = {
    materialItems: new PlayerMaterialItemRepository(),
    materialItemBoxContainer: new MaterialItemBoxContainer(),
    materialItemRenderers: new Map<string, IItemRenderer>(),
    alchemyItem: new PlayerAlchemyItemRepository(),
    alchemyItemBoxContainer: new AlchemyItemBoxContainer(),
    alchemyItemRenderers: new Map<string, IAlchemyItemRenderer>(),
  }

  store.setInit('playerItemStore', playerItemStore)
}

export function resetPlayerItemStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('playerItemStore')
}
