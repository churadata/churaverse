import type { AlchemyItemManager } from '../alchemyItemManager'
import type { IAlchemyPotRenderer } from '../domain/IAlchemyPotRenderer'
import type { IAlchemyPotRendererFactory } from '../domain/IAlchemyPotRendererFactory'
import type { AlchemyPotRepository } from '../repository/alchemyPotRepository'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    alchemyPlugin: AlchemyPluginStore
  }
}

export interface AlchemyPluginStore {
  alchemyPots: AlchemyPotRepository
  alchemyPotRenderers: Map<string, IAlchemyPotRenderer>
  alchemyPotRendererFactory: IAlchemyPotRendererFactory
  alchemyItemManager: AlchemyItemManager
}
