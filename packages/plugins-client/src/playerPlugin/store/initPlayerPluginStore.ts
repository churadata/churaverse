import type { IMainScene, Store } from 'churaverse-engine-client'
import type { IPlayerRenderer } from '../domain/IPlayerRenderer'
import type { IPlayerRendererFactory } from '../domain/IPlayerRendererFactory'
import { PlayersRepository } from '../repository/playerRepository'
import { DeathLogRenderer } from '../ui/deathLog/deathLogRenderer'
import { DeathLogRepository } from '../ui/deathLog/deathLogRepository'
import type { PlayerPluginStore } from './defPlayerPluginStore'

export function initPlayerPluginStore(
  store: Store<IMainScene>,
  rendererFactory: IPlayerRendererFactory | undefined
): void {
  if (rendererFactory === undefined) throw Error('rendererFactory is undefined')

  const playerPluginStore: PlayerPluginStore = {
    players: new PlayersRepository(),
    playerRenderers: new Map<string, IPlayerRenderer>(),
    ownPlayerId: store.of('networkPlugin').socketId,
    playerRendererFactory: rendererFactory,
    deathLogRenderer: new DeathLogRenderer(store.of('coreUiPlugin').fadeOutLogRenderer),
    deathLogRepository: new DeathLogRepository(),
  }
  store.setInit('playerPlugin', playerPluginStore)
}
