import type { Scene } from 'phaser'
import type { AlchemyItemKind } from '../domain/alchemyItemKind'
import type { IAlchemyItemRenderer } from '../domain/IAlchemyItemRenderer'
import type { IAlchemyItemRendererFactory } from '../domain/IAlchemyItemRendererFactory'
import { AlchemyItemRenderer } from './alchemyItemRenderer'

export class AlchemyItemRendererFactory implements IAlchemyItemRendererFactory {
  public constructor(
    private readonly scene: Scene,
    private readonly kind: AlchemyItemKind
  ) {}

  public build(): IAlchemyItemRenderer {
    return new AlchemyItemRenderer(this.scene, this.kind)
  }
}
