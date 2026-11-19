import type { Scene } from 'phaser'
import type { IWaterRingAttackRenderer } from '../domain/IWaterRingAttackRenderer'
import type { IWaterRingAttackRendererFactory } from '../domain/IWaterRingAttackRendererFactory'
import { WaterRingAttackRenderer } from './waterRingAttackRenderer'

export class WaterRingAttackRendererFactory implements IWaterRingAttackRendererFactory {
  public constructor(private readonly scene: Scene) {}

  public build(): IWaterRingAttackRenderer {
    return new WaterRingAttackRenderer(this.scene)
  }
}
