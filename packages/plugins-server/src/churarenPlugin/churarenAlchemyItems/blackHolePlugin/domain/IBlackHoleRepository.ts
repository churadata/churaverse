import type { CollidableEntityRepository } from '@churaverse/collision-detection-plugin-server'
import type { BlackHole } from './blackHole'

export interface IBlackHoleRepository extends CollidableEntityRepository<BlackHole> {
  clear: () => void
}
