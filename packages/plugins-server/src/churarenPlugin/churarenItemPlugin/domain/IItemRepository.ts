import type { CollidableEntityRepository } from '@churaverse/collision-detection-plugin-server'
import type { Item } from './item'

export interface IItemRepository extends CollidableEntityRepository<Item> {
  clear: () => void
}
