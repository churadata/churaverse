import type { AlchemyItemKind } from '@churaverse/churaren-alchemy-base-plugin-server'
import type { ItemKind } from '../domain/itemKind'

export interface IAlchemyItemManager {
  reset: () => void
  getByMaterialItems: (materialItems: ItemKind[]) => AlchemyItemKind
}
