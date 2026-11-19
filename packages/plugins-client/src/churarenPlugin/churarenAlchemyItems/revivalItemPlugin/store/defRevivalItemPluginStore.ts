import type { RevivalItemRepository } from '../repository/revivalItemRepository'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    churarenRevivalItemPlugin: RevivalItemPluginStore
  }
}

export interface RevivalItemPluginStore {
  readonly revivalItems: RevivalItemRepository
}
