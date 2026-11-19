import type { IAlchemyItem } from '@churaverse/churaren-alchemy-plugin-server'
import { AlchemyItem } from '@churaverse/churaren-alchemy-plugin-server'

export const HEALING_POTION_ITEM: IAlchemyItem = {
  kind: 'healingPotion',
  recipe: {
    pattern: 'two_same_one_diff',
    materialKind: 'herb',
  },
}

export class HealingPotion extends AlchemyItem {
  public constructor(itemId: string) {
    super(itemId, HEALING_POTION_ITEM.kind)
  }
}

declare module '@churaverse/churaren-alchemy-plugin-server' {
  export interface AlchemyItemKindMap {
    healingPotion: HealingPotion
  }
}
