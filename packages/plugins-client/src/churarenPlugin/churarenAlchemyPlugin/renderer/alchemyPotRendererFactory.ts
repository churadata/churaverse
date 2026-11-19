import type { Scene } from 'phaser'
import type { IAlchemyPotRenderer } from '../domain/IAlchemyPotRenderer'
import type { IAlchemyPotRendererFactory } from '../domain/IAlchemyPotRendererFactory'
import { AlchemyPotRenderer } from './alchemyPotRenderer'

export class AlchemyPotRendererFactory implements IAlchemyPotRendererFactory {
  public constructor(private readonly scene: Scene) {}

  public build(): IAlchemyPotRenderer {
    return new AlchemyPotRenderer(this.scene)
  }
}
