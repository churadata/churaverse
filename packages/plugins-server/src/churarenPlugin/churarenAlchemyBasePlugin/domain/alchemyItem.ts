import { type AlchemyItemKind, BaseAlchemyItem } from './alchemyItemKind'

export class AlchemyItem extends BaseAlchemyItem {
  public readonly itemId: string
  public readonly kind: AlchemyItemKind

  public constructor(itemId: string, kind: AlchemyItemKind) {
    super(itemId, kind)
    this.itemId = itemId
    this.kind = kind
  }
}
