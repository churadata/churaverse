import type { Scenes, Store } from 'churaverse-engine-client'
import type { IDataPersistence } from '../interface/IDataPersistence'
import type { DataPersistencePluginStore } from './defDataPersistencePluginStore'

export function initDataPersistencePluginStore(store: Store<Scenes>, dataPersistence: IDataPersistence): void {
  const dataPersistencePluginStore: DataPersistencePluginStore = {
    dataPersistence,
  }

  store.setInit('dataPersistencePlugin', dataPersistencePluginStore)
}
