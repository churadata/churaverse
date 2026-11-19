import type { Scene } from 'phaser'
import type { IBossAttackRenderer } from '../domain/IBossAttackRenderer'
import type { IBossAttackRendererFactory } from '../domain/IBossAttackRendererFactory'
import { BossAttackRenderer } from './bossAttackRenderer'

export class BossAttackRendererFactory implements IBossAttackRendererFactory {
  public constructor(private readonly scene: Scene) {}

  public build(): IBossAttackRenderer {
    return new BossAttackRenderer(this.scene)
  }
}
