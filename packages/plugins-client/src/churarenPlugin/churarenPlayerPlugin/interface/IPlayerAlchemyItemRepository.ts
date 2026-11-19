import type { AlchemyItem } from '@churaverse/churaren-alchemy-base-plugin-client'

export interface IPlayerAlchemyItemRepository {
  set: (playerId: string, item: AlchemyItem) => void
  get: (playerId: string) => AlchemyItem | undefined
  delete: (playerId: string) => void
  clear: () => void
}
