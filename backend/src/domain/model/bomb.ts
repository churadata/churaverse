import { ICollidableEntity } from '../core/collisionDetection/collidableEntity/ICollidableEntity'
import { IRectangle } from '../core/collisionDetection/collidableEntity/IRectangle'
import { Position } from '../core/position'

export class Bomb implements ICollidableEntity {
  public isCollidable = false
  public getRect(): IRectangle {
    return {
      width: 80,
      height: 80,
      position: this.position.copy(),
    }
  }

  public readonly power = 50
  public readonly timeLimit = 875 // 設置してから爆発するまでの時間

  public constructor(
    public readonly ownerId: string,
    private readonly position: Position,
    private readonly spawnTime: number
  ) {}

  public explode(): void {
    this.isCollidable = true
  }

  /**
   * 設置してからの時間がtimeLimitを超えていた場合true
   */
  public get isExplode(): boolean {
    return Date.now() - this.spawnTime >= this.timeLimit
  }
}
