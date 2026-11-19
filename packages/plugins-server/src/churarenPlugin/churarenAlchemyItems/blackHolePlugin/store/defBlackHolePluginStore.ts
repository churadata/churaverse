import type { IBlackHoleRepository } from '../domain/IBlackHoleRepository'

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    churarenBlackHolePlugin: BlackHolePluginStore
  }
}

export interface BlackHolePluginStore {
  readonly blackHoles: IBlackHoleRepository
}
