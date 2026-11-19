import type { IPlayerRenderer } from '../domain/IPlayerRenderer'
import type { IPlayerRendererFactory } from '../domain/IPlayerRendererFactory'
import type { IDeathLogRenderer } from '../interface/IDeathLogRenderer'
import type { PlayersRepository } from '../repository/playerRepository'
import type { DeathLogRepository } from '../ui/deathLog/deathLogRepository'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    playerPlugin: PlayerPluginStore
  }
}

export interface PlayerPluginStore {
  readonly players: PlayersRepository
  readonly playerRenderers: Map<string, IPlayerRenderer>
  readonly playerRendererFactory: IPlayerRendererFactory
  readonly ownPlayerId: string
  readonly deathLogRenderer: IDeathLogRenderer
  readonly deathLogRepository: DeathLogRepository
}
