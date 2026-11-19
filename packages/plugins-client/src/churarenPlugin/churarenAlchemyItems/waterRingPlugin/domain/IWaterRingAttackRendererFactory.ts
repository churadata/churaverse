import type { IWaterRingAttackRenderer } from './IWaterRingAttackRenderer'

export interface IWaterRingAttackRendererFactory {
  build: () => IWaterRingAttackRenderer
}
