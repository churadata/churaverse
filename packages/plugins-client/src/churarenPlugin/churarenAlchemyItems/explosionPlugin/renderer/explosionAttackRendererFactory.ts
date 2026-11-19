import type { Scene } from 'phaser'
import type { IExplosionAttackRenderer } from '../domain/IExplosionAttackRenderer'
import type { IExplosionAttackRendererFactory } from '../domain/IExplosionAttackRendererFactory'
import { ExplosionAttackRenderer } from './explosionAttackRenderer'

export class ExplosionAttackRendererFactory implements IExplosionAttackRendererFactory {
  public constructor(private readonly scene: Scene) {}

  public build(): IExplosionAttackRenderer {
    return new ExplosionAttackRenderer(this.scene)
  }
}
