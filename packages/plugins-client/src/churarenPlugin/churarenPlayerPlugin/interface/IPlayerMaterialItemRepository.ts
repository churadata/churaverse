import type { Item } from '@churaverse/churaren-item-plugin-client'

export interface IPlayerMaterialItemRepository {
  set: (playerId: string, item: Item) => void
  get: (playerId: string, itemIndex: number) => Item | undefined
  delete: (playerId: string, itemId: string) => void
  getAllItem: (playerId: string) => Item[]
  clearAll: () => void
}
