import type { Scene } from 'phaser'
import type { ITrapAttackRenderer } from '../domain/ITrapAttackRenderer'
import type { ITrapAttackRendererFactory } from '../domain/ITrapAttackRendererFactory'
import { TrapAttackRenderer } from './trapAttackRenderer'

export class TrapAttackRendererFactory implements ITrapAttackRendererFactory {
  public constructor(private readonly scene: Scene) {}

  public build(): ITrapAttackRenderer {
    return new TrapAttackRenderer(this.scene)
  }
}
