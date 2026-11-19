import type { IAlchemyItem } from '@churaverse/churaren-alchemy-plugin-server'
import { AlchemyItem } from '@churaverse/churaren-alchemy-plugin-server'

export const REVIVAL_ITEM: IAlchemyItem = {
  kind: 'revivalItem',
  recipe: {
    pattern: 'all_same',
    materialKind: 'herb',
  },
}

export class RevivalItem extends AlchemyItem {
  public constructor(itemId: string) {
    super(itemId, REVIVAL_ITEM.kind)
  }
}

declare module '@churaverse/churaren-alchemy-plugin-server' {
  export interface AlchemyItemKindMap {
    revivalItem: RevivalItem
  }
}
