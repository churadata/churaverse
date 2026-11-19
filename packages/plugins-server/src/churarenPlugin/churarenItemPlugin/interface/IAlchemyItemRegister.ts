import type { AlchemyItemKind } from '@churaverse/churaren-alchemy-base-plugin-server'
import type { AlchemyItemRecipe } from './IAlchemyItemRecipe'

export interface IAlchemyItemRegister {
  register: (recipe: AlchemyItemRecipe, result: AlchemyItemKind) => void
}
