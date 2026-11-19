import type { IWaterRingAttackRenderer } from '../domain/IWaterRingAttackRenderer'
import type { IWaterRingAttackRendererFactory } from '../domain/IWaterRingAttackRendererFactory'
import type { WaterRingRepository } from '../repository/waterRingRepository'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    churarenWaterRingPlugin: WaterRingPluginStore
  }
}

export interface WaterRingPluginStore {
  readonly waterRings: WaterRingRepository
  readonly waterRingAttackRenderers: Map<string, IWaterRingAttackRenderer>
  readonly waterRingAttackRendererFactory: IWaterRingAttackRendererFactory
}
