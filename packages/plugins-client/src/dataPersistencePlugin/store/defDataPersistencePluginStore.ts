import type { IDataPersistence } from '../interface/IDataPersistence'
export interface DataPersistencePluginStore {
  dataPersistence: IDataPersistence
}

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    dataPersistencePlugin: DataPersistencePluginStore
  }
  export interface StoreInTitle {
    dataPersistencePlugin: DataPersistencePluginStore
  }
}
