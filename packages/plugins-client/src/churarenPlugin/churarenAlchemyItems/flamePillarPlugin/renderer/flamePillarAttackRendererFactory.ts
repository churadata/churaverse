import type { Scene } from 'phaser'
import type { IFlamePillarAttackRenderer } from '../domain/IFlamePillarAttackRenderer'
import type { IFlamePillarAttackRendererFactory } from '../domain/IFlamePillarAttackRendererFactory'
import { FlamePillarAttackRenderer } from './flamePillarAttackRenderer'

export class FlamePillarAttackRendererFactory implements IFlamePillarAttackRendererFactory {
  public constructor(private readonly scene: Scene) {}

  public build(): IFlamePillarAttackRenderer {
    return new FlamePillarAttackRenderer(this.scene)
  }
}
