import type { IPlayerRepository } from '../domain/IPlayerRepository'

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    playerPlugin: PlayerPluginStore
  }
}

export interface PlayerPluginStore {
  readonly players: IPlayerRepository
}
