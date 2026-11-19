import type { AlchemyItemRecipe } from '@churaverse/churaren-item-plugin-server'
import type { AlchemyItemKind } from './alchemyItemKind'

export interface IAlchemyItem {
  kind: AlchemyItemKind
  recipe: AlchemyItemRecipe
}
