import type { IBetCoinRepository } from '../interface/IBetCoinRepository'
import type { INyokkiRepository } from '../interface/INyokkiRepository'
import type { IPlayersCoinRepository } from '../interface/IPlayersCoinRepository'

export interface SynchroBreakPluginStore {
  readonly nyokkiRepository: INyokkiRepository
  readonly playersCoinRepository: IPlayersCoinRepository
  readonly betCoinRepository: IBetCoinRepository
  timeLimit: number | undefined
  turnSelect: number | undefined
}

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    synchroBreakPlugin: SynchroBreakPluginStore
  }
}
