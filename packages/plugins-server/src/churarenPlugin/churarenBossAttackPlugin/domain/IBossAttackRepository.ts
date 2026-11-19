import type { CollidableEntityRepository } from '@churaverse/collision-detection-plugin-server'
import type { BossAttack } from './bossAttack'

export interface IBossAttackRepository extends CollidableEntityRepository<BossAttack> {
  clear: () => void
}
