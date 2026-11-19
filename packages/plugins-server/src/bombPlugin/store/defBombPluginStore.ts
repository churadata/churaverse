import type { IBombRepository } from '../domain/IBombRepository'

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    bombPlugin: BombPluginStore
  }
}

export interface BombPluginStore {
  readonly bombs: IBombRepository
}
