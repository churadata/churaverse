import type { IWaterRingRepository } from '../domain/IWaterRingRepository'

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    waterRingPlugin: WaterRingPluginStore
  }
}

export interface WaterRingPluginStore {
  readonly waterRings: IWaterRingRepository
}
