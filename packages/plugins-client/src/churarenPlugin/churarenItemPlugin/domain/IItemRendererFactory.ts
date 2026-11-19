import type { IItemRenderer } from './IItemRenderer'
import type { ItemKind } from './itemKind'

export interface IItemRendererFactory {
  build: (kind: ItemKind) => IItemRenderer
}
