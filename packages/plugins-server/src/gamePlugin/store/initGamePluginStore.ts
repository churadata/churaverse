import type { IMainScene, Store } from 'churaverse-engine-server'
import { GameInfoRepository } from '../repository/gameInfoRepository'
import type { GamePluginStore } from './defGamePluginStore'

export function initGamePluginStore(store: Store<IMainScene>): void {
  const gamePluginStore: GamePluginStore = {
    games: new GameInfoRepository(),
  }

  store.setInit('gamePlugin', gamePluginStore)
}
