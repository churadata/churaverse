import type { IMainScene, Store } from 'churaverse-engine-client'
import { NyokkiLogTextCreator } from '../domain/nyokkiLogTextCreator'
import { PlayersCoinRepository } from '../repository/playersCoinRepository'
import type { PlayerNyokkiStatusIcon } from '../ui/synchroBreakIcon/playerNyokkiStatusIcon'
import type { SynchroBreakPluginStore } from './defSynchroBreakPluginStore'

/**
 * SynchroBreakPluginStoreを初期化する関数
 */
export function initSynchroBreakPluginStore(store: Store<IMainScene>): void {
  const synchroBreakPluginStore: SynchroBreakPluginStore = {
    synchroBreakIcons: new Map<string, PlayerNyokkiStatusIcon>(),
    playersCoinRepository: new PlayersCoinRepository(),
    nyokkiLogTextCreator: new NyokkiLogTextCreator(store),
    timeLimit: undefined,
    gameTurn: undefined,
  }

  store.setInit('synchroBreakPlugin', synchroBreakPluginStore)
}

/**
 * SynchroBreakPluginStoreをリセットする関数
 */
export function resetSynchroBreakPluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('synchroBreakPlugin')
}
