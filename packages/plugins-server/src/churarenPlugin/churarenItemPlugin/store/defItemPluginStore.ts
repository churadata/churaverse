import type { IItemRepository } from '../domain/IItemRepository'
import type { IAlchemyItemManager } from '../interface/IAlchemyItemManager'
import type { IAlchemyItemRegister } from '../interface/IAlchemyItemRegister'

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    churarenItemPlugin: ItemPluginStore
  }
}

export interface ItemPluginStore {
  readonly items: IItemRepository
  readonly alchemyItemManager: IAlchemyItemManager
  readonly alchemyItemRegister: IAlchemyItemRegister
}
