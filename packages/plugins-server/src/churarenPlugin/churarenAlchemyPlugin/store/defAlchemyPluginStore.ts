import type { IAlchemyPotRepository } from '../domain/IAlchemyPotRepository'

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    alchemyPlugin: AlchemyPluginStore
  }
}

export interface AlchemyPluginStore {
  readonly alchemyPots: IAlchemyPotRepository
}
