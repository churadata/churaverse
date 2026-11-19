import type { Scene } from 'phaser'
import type { IItemRenderer } from '../domain/IItemRenderer'
import type { IItemRendererFactory } from '../domain/IItemRendererFactory'
import type { ItemKind } from '../domain/itemKind'
import { ItemRenderer } from './itemRenderer'

export class ItemRendererFactory implements IItemRendererFactory {
  public constructor(private readonly scene: Scene) {}

  public build(kind: ItemKind): IItemRenderer {
    return new ItemRenderer(this.scene, kind)
  }
}
