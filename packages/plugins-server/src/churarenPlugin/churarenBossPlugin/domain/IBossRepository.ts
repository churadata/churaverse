import type { CollidableEntityRepository } from '@churaverse/collision-detection-plugin-server'
import type { Boss } from './boss'

export interface IBossRepository extends CollidableEntityRepository<Boss> {
  clear: () => void
}
