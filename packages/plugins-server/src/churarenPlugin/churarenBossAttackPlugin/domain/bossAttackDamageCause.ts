import { ChurarenEnemyDamageCause } from '@churaverse/churaren-core-plugin-server'
import type { BossAttack } from './bossAttack'

/**
 * ボスの攻撃との当たり判定によるダメージを表すクラス
 * @param collisionName 当たり判定の名前
 * @param collisionEntity 当たり判定のエンティティ
 */

export class BossAttackDamageCause extends ChurarenEnemyDamageCause {
  public constructor(public readonly bossAttack: BossAttack) {
    super('bossAttack', bossAttack)
  }
}

declare module 'churaverse-engine-server' {
  export interface DamageCauseMap {
    bossAttack: BossAttackDamageCause
  }
}
