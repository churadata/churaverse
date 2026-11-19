import type { INyokkiLogTextCreator } from '../interface/INyokkiLogTextCreator'
import type { IPlayersCoinRepository } from '../interface/IPlayersCoinRepository'
import type { PlayerNyokkiStatusIcon } from '../ui/synchroBreakIcon/playerNyokkiStatusIcon'

export interface SynchroBreakPluginStore {
  readonly synchroBreakIcons: Map<string, PlayerNyokkiStatusIcon>
  readonly playersCoinRepository: IPlayersCoinRepository
  readonly nyokkiLogTextCreator: INyokkiLogTextCreator
  timeLimit: number | undefined
  gameTurn: number | undefined
}

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    synchroBreakPlugin: SynchroBreakPluginStore
  }
}
