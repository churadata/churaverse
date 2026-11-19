import type { ISharkRepository } from '../domain/ISharkRepository'

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    sharkPlugin: SharkPluginStore
  }
}

export interface SharkPluginStore {
  readonly sharks: ISharkRepository
}
