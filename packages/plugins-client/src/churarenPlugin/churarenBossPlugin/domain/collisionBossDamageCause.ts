import { ChurarenEnemyDamageCause } from '@churaverse/churaren-core-plugin-client'
import type { Entity } from 'churaverse-engine-client'

export class CollisionBossDamageCause extends ChurarenEnemyDamageCause {
  public constructor(public readonly boss: Entity) {
    super('collisionBoss', boss)
  }
}

declare module 'churaverse-engine-client' {
  export interface DamageCauseMap {
    collisionBoss: CollisionBossDamageCause
  }
}
