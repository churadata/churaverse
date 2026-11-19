import type { ICollidableEntity } from '../domain/collisionDetection/collidableEntity/ICollidableEntity'
import type { CollidableEntityRepository } from '../domain/collisionDetection/collidableEntityRepository'
import type { OnOverlap } from '../domain/collisionDetection/collistionDetection'

export interface ICollisionDetector {
  /**
   * 衝突時のcallbackを登録する. 衝突判定はupdateEventがpostされたタイミングで行われる.
   * 引数で渡した2つリポジトリ内のオブジェクト同士が重なった際にcallbackが実行される.
   * callbackの引数には衝突したオブジェクトとそのidが渡される.
   *
   * @param entityRepository1 衝突対象のentityのリポジトリ1
   * @param entityRepository2 衝突対象のentityのリポジトリ2
   * @param onOverlap 衝突時に実行されるcallback. 第一引数がentityRepository1のentity, 第二引数がentityRepository2のentity.
   */
  register: <T1 extends ICollidableEntity, T2 extends ICollidableEntity>(
    entityRepository1: CollidableEntityRepository<T1>,
    entityRepository2: CollidableEntityRepository<T2>,
    onOverlap: OnOverlap<T1, T2>
  ) => void
}
