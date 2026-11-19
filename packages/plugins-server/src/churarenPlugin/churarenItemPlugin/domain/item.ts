import type { ICollidableEntity, IRectangle } from '@churaverse/collision-detection-plugin-server'
import { Direction, Entity, type Position } from 'churaverse-engine-server'
import type { ItemKind } from './itemKind'

export class Item extends Entity implements ICollidableEntity {
  public isCollidable = true
  public readonly itemId: string
  public readonly spawnTime: number
  public readonly timeLimit = 10000 // 設置してからアイテムが消えるまでの時間(ms)
  public readonly kind: ItemKind // アイテムの種類

  public get id(): string {
    return this.itemId
  }

  public getRect(): IRectangle {
    return {
      width: 50,
      height: 50,
      position: this.position.copy(),
    }
  }

  public constructor(itemId: string, position: Position, spawnTime: number, kind: ItemKind) {
    super(position, Direction.down)
    this.itemId = itemId
    this.spawnTime = spawnTime
    this.kind = kind
  }

  /**
   * 設置してからの時間がtimeLimitを超えていた場合true
   */
  public get isDespawn(): boolean {
    return Date.now() - this.spawnTime >= this.timeLimit
  }
}
