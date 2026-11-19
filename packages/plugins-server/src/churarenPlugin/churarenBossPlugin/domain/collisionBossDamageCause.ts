import { ChurarenEnemyDamageCause } from '@churaverse/churaren-core-plugin-server'
import type { Entity } from 'churaverse-engine-server'

/**
 * ボスとの当たり判定によるダメージを表すクラス
 * @param collisionName 当たり判定の名前
 * @param collisionEntity 当たり判定のエンティティ
 */
export class CollisionBossDamageCause extends ChurarenEnemyDamageCause {
  public constructor(public readonly boss: Entity) {
    super('collisionBoss', boss)
  }
}

declare module 'churaverse-engine-server' {
  export interface DamageCauseMap {
    collisionBoss: CollisionBossDamageCause
  }
}
