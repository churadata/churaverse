import type { IMapManager } from '../interface/IMapManager'

export interface MapPluginStore {
  readonly mapManager: IMapManager
}

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    mapPlugin: MapPluginStore
  }
}
