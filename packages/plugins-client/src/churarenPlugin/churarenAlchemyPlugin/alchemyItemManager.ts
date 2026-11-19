import type { AlchemyItemKind } from './domain/alchemyItemKind'
import type { IAlchemyItem } from './domain/IAlchemyItem'
import type { IAlchemyItemRendererFactory } from './domain/IAlchemyItemRendererFactory'
import { AlchemyItemRenderer } from './renderer/alchemyItemRenderer'
import { AlchemyItemRendererFactory } from './renderer/alchemyItemRendererFactory'

interface IAlchemyItemInfo extends IAlchemyItem {
  rendererFactory: IAlchemyItemRendererFactory
}

export class AlchemyItemManager {
  private readonly items = new Map<AlchemyItemKind, IAlchemyItemInfo>()

  public constructor(private readonly scene: Phaser.Scene) {}

  public static loadAssets(scene: Phaser.Scene, kind: AlchemyItemKind, image: string): void {
    AlchemyItemRenderer.loadAssets(scene, kind, image)
  }

  public set(kind: AlchemyItemKind, item: IAlchemyItem): void {
    if (this.items.has(kind)) {
      throw new Error(`Item of kind ${kind} already exists`)
    }
    const rendererFactory = new AlchemyItemRendererFactory(this.scene, kind)
    this.items.set(kind, { ...item, rendererFactory })
  }

  public get(kind: AlchemyItemKind): IAlchemyItemInfo {
    const item = this.items.get(kind)
    if (item === undefined) {
      throw new Error(`Item of kind ${kind} does not exist`)
    }
    return item
  }
}
