import type { IMainScene, Store } from 'churaverse-engine-server'
import { GhostModePlayerRepository } from '../repository/ghostModePlayerRepository'

export function initChurarenPlayersStore(store: Store<IMainScene>): void {
  const churarenPlayersStore = {
    ghostModePlayers: new GhostModePlayerRepository(),
  }

  store.setInit('churarenPlayers', churarenPlayersStore)
}

export function resetChurarenPlayersStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('churarenPlayers')
}
