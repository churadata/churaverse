import type { IGameInfoRepository } from '../interface/IGameInfoRepository'

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    gamePlugin: GamePluginStore
  }
}

export interface GamePluginStore {
  readonly games: IGameInfoRepository
}
