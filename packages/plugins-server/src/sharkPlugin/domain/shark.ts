import type { ICollidableEntity, IRectangle } from '@churaverse/collision-detection-plugin-server'
import type { WorldMap } from '@churaverse/map-plugin-server'
import { type Direction, Entity, type Position, type Vector, type WeaponEntity } from 'churaverse-engine-server'

export const SHARK_WALK_LIMIT_GRIDS = 25
export const SHARK_WALK_LIMIT_MS = 2400

export class Shark extends Entity implements ICollidableEntity, WeaponEntity {
  public isCollidable = true
  public getRect(): IRectangle {
    return {
      width: this._width,
      height: this._height,
      position: this.position.copy(),
    }
  }

  public get id(): string {
    return this.sharkId
  }

  private _isDead = false
  public readonly sharkId: string
  public readonly ownerId: string // サメを撃ったプレイヤーのid
  public readonly power = 20
  public readonly spawnTime: number
  private _velocity: Vector

  private readonly LONG_SIDE = 90
  private readonly SHORT_SIDE = 30
  private readonly _width: number
  private readonly _height: number

  public constructor(sharkId: string, ownerId: string, position: Position, direction: Direction, spawnTime: number) {
    super(position, direction)
    this.sharkId = sharkId
    this.ownerId = ownerId
    this.spawnTime = spawnTime

    // サメは長方形のため向きによって幅・高さが入れ替わる
    // _direction.xが0 = up or down
    this._width = this.direction.x === 0 ? this.SHORT_SIDE : this.LONG_SIDE
    this._height = this.direction.x === 0 ? this.LONG_SIDE : this.SHORT_SIDE

    // walkするまでは停止
    this._velocity = { x: 0, y: 0 }
  }

  public walk(worldMap: WorldMap): void {
    const moveDistance = SHARK_WALK_LIMIT_GRIDS * worldMap.gridSize
    const speed = moveDistance / SHARK_WALK_LIMIT_MS
    this._velocity = {
      x: this.direction.x * speed,
      y: this.direction.y * speed,
    }
  }

  public set isDead(_isDead: boolean) {
    this._isDead = _isDead
  }

  /**
   * isDeadがtrueでなくともスポーン後SHARK_WALK_LIMIT_MS経過している場合はfalseになる
   */
  public get isDead(): boolean {
    const now = Date.now()
    if (now - this.spawnTime >= SHARK_WALK_LIMIT_MS) {
      this._isDead = true
    }
    return this._isDead
  }

  public die(): void {
    this._isDead = true
    this.isCollidable = false
  }

  public move(dt: number): void {
    this.position.x += this._velocity.x * dt
    this.position.y += this._velocity.y * dt
  }
}
