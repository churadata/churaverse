import type { ICollidableEntity, IRectangle } from '@churaverse/collision-detection-plugin-server'
import { type Direction, Entity, type Position } from 'churaverse-engine-server'

export class Bomb extends Entity implements ICollidableEntity {
  public isCollidable = false
  public readonly bombId: string
  public readonly ownerId: string // 爆弾を置いたプレイヤーのid
  public readonly spawnTime: number
  public readonly power = 50
  public readonly timeLimit = 875 // 設置してから爆発するまでの時間

  public get id(): string {
    return this.bombId
  }

  public getRect(): IRectangle {
    return {
      width: 80,
      height: 80,
      position: this.position.copy(),
    }
  }

  public constructor(bombId: string, ownerId: string, position: Position, direction: Direction, spawnTime: number) {
    super(position, direction)
    this.bombId = bombId
    this.ownerId = ownerId
    this.spawnTime = spawnTime
  }

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
