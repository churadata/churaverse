import type { IMapManager } from '../interface/IMapManager'

export interface MapPluginStore {
  readonly mapManager: IMapManager
}

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    mapPlugin: MapPluginStore
  }
}
