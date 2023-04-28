import { ICollidableEntity } from './collidableEntity/ICollidableEntity'
import { LinearQuadTreeSpace } from './linearQuadTreeSpace'
import { EntityRepository } from '../../IRepository/entityRepository'
import { WorldMap } from '../../model/worldMap'

/**
 * 当たり判定を取るオブジェクトのリポジトリはこのクラスを継承する
 * 四分木への追加・削除のため、子クラスのset()/delete()ではsuper.set()/super.delete()を呼ぶ必要がある
 */
export abstract class CollidableEntityRepository<T extends ICollidableEntity>
  implements EntityRepository<T>
{
  constructor(private readonly worldMap: WorldMap) {}
  private readonly qtree: LinearQuadTreeSpace = new LinearQuadTreeSpace(
    this.worldMap
  )

  public set(id: string, entity: T): void {
    this.qtree.addActor(id, entity.getRect())
  }

  public delete(id: string): void {
    this.qtree.removeActor(id)
  }

  /**
   * 四分木の更新を行う
   * Repository内のインスタンスの位置・幅・高さが変化した場合はこのメソッドを必ず実行すること
   */
  public updateActor(id: string, entity: T): void {
    this.qtree.updateActor(id, entity.getRect())
  }

  /**
   * 四分木を返す
   */
  public get qtreeData(): Array<Set<string> | null> {
    return this.qtree.data
  }

  public abstract get(id: string): T | undefined
  public abstract getAllId(): string[]
}
