import type { Scene } from 'phaser'
import type { ISharkRenderer } from '../domain/ISharkRenderer'
import type { ISharkRendererFactory } from '../domain/ISharkRendererFactory'
import { SharkRenderer } from './sharkRenderer'

export class SharkRendererFactory implements ISharkRendererFactory {
  public constructor(private readonly scene: Scene) {}

  public build(): ISharkRenderer {
    return new SharkRenderer(this.scene)
  }
}
