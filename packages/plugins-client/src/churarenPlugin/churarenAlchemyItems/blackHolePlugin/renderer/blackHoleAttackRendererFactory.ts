import type { Scene } from 'phaser'
import type { IBlackHoleAttackRenderer } from '../domain/IBlackHoleAttackRenderer'
import type { IBlackHoleAttackRendererFactory } from '../domain/IBlackHoleAttackRendererFactory'
import { BlackHoleAttackRenderer } from './blackHoleAttackRenderer'

export class BlackHoleAttackRendererFactory implements IBlackHoleAttackRendererFactory {
  public constructor(private readonly scene: Scene) {}

  public build(): IBlackHoleAttackRenderer {
    return new BlackHoleAttackRenderer(this.scene)
  }
}
