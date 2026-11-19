import type { CollidableEntityRepository } from '@churaverse/collision-detection-plugin-server'
import type { AlchemyPot } from './alchemyPot'

export interface IAlchemyPotRepository extends CollidableEntityRepository<AlchemyPot> {
  clear: () => void
}
