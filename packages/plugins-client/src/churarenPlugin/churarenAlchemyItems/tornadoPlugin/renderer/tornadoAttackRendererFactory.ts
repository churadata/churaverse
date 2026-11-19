import type { Scene } from 'phaser'
import type { ITornadoAttackRenderer } from '../domain/ITornadoAttackRenderer'
import type { ITornadoAttackRendererFactory } from '../domain/ITornadoAttackRendererFactory'
import { TornadoAttackRenderer } from './tornadoAttackRenderer'

export class TornadoAttackRendererFactory implements ITornadoAttackRendererFactory {
  public constructor(private readonly scene: Scene) {}

  public build(): ITornadoAttackRenderer {
    return new TornadoAttackRenderer(this.scene)
  }
}
