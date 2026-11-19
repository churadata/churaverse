import { ChurarenEnemyDamageCause } from '@churaverse/churaren-core-plugin-client'
import type { BossAttack } from './bossAttack'

export class BossAttackDamageCause extends ChurarenEnemyDamageCause {
  public constructor(public readonly bossAttack: BossAttack) {
    super('bossAttack', bossAttack)
  }
}

declare module 'churaverse-engine-client' {
  export interface DamageCauseMap {
    bossAttack: BossAttackDamageCause
  }
}
