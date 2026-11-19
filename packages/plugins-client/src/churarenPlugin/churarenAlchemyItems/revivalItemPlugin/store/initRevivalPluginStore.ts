import type { IMainScene, Store } from 'churaverse-engine-client'
import { RevivalItemRepository } from '../repository/revivalItemRepository'
import type { RevivalItemPluginStore } from './defRevivalItemPluginStore'

export function initRevivalPluginStore(store: Store<IMainScene>): void {
  const revivalItemPluginStore: RevivalItemPluginStore = {
    revivalItems: new RevivalItemRepository(),
  }

  store.setInit('churarenRevivalItemPlugin', revivalItemPluginStore)
}

export function resetRevivalPluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('churarenRevivalItemPlugin')
}
