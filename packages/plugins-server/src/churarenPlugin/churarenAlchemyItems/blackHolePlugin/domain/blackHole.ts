import type { IAlchemyItem } from '@churaverse/churaren-alchemy-plugin-server'
import { AlchemyItem } from '@churaverse/churaren-alchemy-plugin-server'
import type { ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-server'
import type { ICollidableEntity, IRectangle } from '@churaverse/collision-detection-plugin-server'
import { Direction, GRID_SIZE, Position, type Vector, vectorToName } from 'churaverse-engine-server'

const BLACK_HOLE_DISABLE_COLLISION_LIMIT_MS = 1000
const BLACK_HOLE_SPAWN_LIMIT_MS = 10000
const BLACK_HOLE_WALK_LIMIT_GRIDS = 2
const BLACK_HOLE_WALK_LIMIT_MS = 1500
const BLACK_HOLE_WALK_SPEED = (BLACK_HOLE_WALK_LIMIT_GRIDS * GRID_SIZE) / BLACK_HOLE_WALK_LIMIT_MS
export const BLACK_HOLE_ITEM: IAlchemyItem = {
  kind: 'blackHole',
  recipe: {
    pattern: 'all_diff',
    materialKind: 'fireOre', // all_diffなのでmaterialKindは影響しない
  },
}

/**
 * blackHoleクラスの定義
 */
export class BlackHole extends AlchemyItem implements ICollidableEntity, ChurarenWeaponEntity {
  public isCollidable = true
  public getRect(): IRectangle {
    return {
      width: this.BLACKHOLE_SIZE,
      height: this.BLACKHOLE_SIZE,
      position: this.position.copy(),
    }
  }

  public get id(): string {
    return this.blackHoleId
  }

  public _isDead = false
  public readonly power = 20
  public readonly blackHoleId: string
  public readonly churarenWeaponOwnerId: string
  public readonly spawnTime: number
  private readonly _velocity: Vector
  private moveDirection: Direction = Direction.right
  private readonly _startPosition: Position
  private readonly _reversePosition: Position

  private readonly BLACKHOLE_SIZE = 140

  public constructor(
    blackHoleId: string,
    ownerId: string,
    position: Position,
    direction: Direction,
    spawnTime: number
  ) {
    super(blackHoleId, BLACK_HOLE_ITEM.kind)
    this.blackHoleId = blackHoleId
    this.churarenWeaponOwnerId = ownerId
    this.spawnTime = spawnTime
    this.position = position
    this.direction = direction
    this._startPosition = this.position.copy()
    if (vectorToName(this.direction) === 'left' || vectorToName(this.direction) === 'up') {
      this._reversePosition = new Position(this.position.x - BLACK_HOLE_WALK_LIMIT_GRIDS, this.position.y)
    } else {
      this._reversePosition = new Position(this.position.x + BLACK_HOLE_WALK_LIMIT_GRIDS, this.position.y)
    }

    this._velocity = { x: 0, y: 0 }
  }

  public disableCollisionTemporarily(): void {
    this.isCollidable = false

    // 1秒後に再び有効にする
    setTimeout(() => {
      this.isCollidable = true
    }, BLACK_HOLE_DISABLE_COLLISION_LIMIT_MS)
  }

  public get isDead(): boolean {
    const now = Date.now()
    if (now - this.spawnTime >= BLACK_HOLE_SPAWN_LIMIT_MS) {
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

  public walk(): void {
    if (vectorToName(this.direction) === 'left' || vectorToName(this.direction) === 'up') {
      this.moveDirection = Direction.left
    } else {
      this.moveDirection = Direction.right
    }
    this._velocity.x = BLACK_HOLE_WALK_SPEED * this.moveDirection.x
  }

  public reverseVelocityX(): void {
    this._velocity.x *= -1
  }

  public get startPosition(): Position {
    return this._startPosition
  }

  public get reversePosition(): Position {
    return this._reversePosition
  }
}

declare module '@churaverse/churaren-alchemy-plugin-server' {
  export interface AlchemyItemKindMap {
    blackHole: BlackHole
  }
}
