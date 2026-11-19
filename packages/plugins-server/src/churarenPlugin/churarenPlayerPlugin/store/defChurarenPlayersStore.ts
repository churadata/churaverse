import type { GhostModePlayerRepository } from '../repository/ghostModePlayerRepository'

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    churarenPlayers: ChurarenPlayersStore
  }
}

export interface ChurarenPlayersStore {
  readonly ghostModePlayers: GhostModePlayerRepository
}
