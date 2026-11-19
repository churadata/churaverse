import type { Scene } from 'phaser'
import type { IIceArrowAttackRenderer } from '../domain/IIceArrowAttackRenderer'
import type { IIceArrowAttackRendererFactory } from '../domain/IIceArrowAttackRendererFactory'
import { IceArrowAttackRenderer } from './iceArrowAttackRenderer'

export class IceArrowAttackRendererFactory implements IIceArrowAttackRendererFactory {
  public constructor(private readonly scene: Scene) {}

  public build(): IIceArrowAttackRenderer {
    return new IceArrowAttackRenderer(this.scene)
  }
}
