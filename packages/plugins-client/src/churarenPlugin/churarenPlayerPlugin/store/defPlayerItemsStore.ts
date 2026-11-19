import type { IAlchemyItemRenderer } from '@churaverse/churaren-alchemy-base-plugin-client'
import type { IItemRenderer } from '@churaverse/churaren-item-plugin-client'
import type { IAlchemyItemBoxContainer } from '../interface/IAlchemyItemBoxContainer'
import type { IMaterialItemBoxContainer } from '../interface/IMaterialItemBoxContainer'
import type { IPlayerAlchemyItemRepository } from '../interface/IPlayerAlchemyItemRepository'
import type { IPlayerMaterialItemRepository } from '../interface/IPlayerMaterialItemRepository'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    playerItemStore: PlayerItemsStore
  }
}

export interface PlayerItemsStore {
  materialItems: IPlayerMaterialItemRepository
  materialItemBoxContainer: IMaterialItemBoxContainer
  materialItemRenderers: Map<string, IItemRenderer>
  alchemyItem: IPlayerAlchemyItemRepository
  alchemyItemBoxContainer: IAlchemyItemBoxContainer
  alchemyItemRenderers: Map<string, IAlchemyItemRenderer>
}
