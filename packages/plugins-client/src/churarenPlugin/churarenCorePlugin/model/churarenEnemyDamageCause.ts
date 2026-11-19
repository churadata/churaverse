import { DamageCause, type DamageCauseType, type Entity } from 'churaverse-engine-client'

/**
 * プレイヤー以外の敵によるダメージの抽象クラス
 * @param entityName 敵の名前
 * @param entity 敵のエンティティ
 */
export abstract class ChurarenEnemyDamageCause extends DamageCause {
  public constructor(
    public readonly entityName: DamageCauseType,
    public readonly entity: Entity
  ) {
    super(entityName)
  }
}
