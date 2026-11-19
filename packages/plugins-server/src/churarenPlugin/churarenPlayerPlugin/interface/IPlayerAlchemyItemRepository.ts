import type { AlchemyItem } from '@churaverse/churaren-alchemy-base-plugin-server'

export interface IPlayerAlchemyItemRepository {
  set: (playerId: string, item: AlchemyItem) => void
  delete: (playerId: string) => void
  get: (playerId: string) => AlchemyItem | undefined
  clearAll: () => void
}
