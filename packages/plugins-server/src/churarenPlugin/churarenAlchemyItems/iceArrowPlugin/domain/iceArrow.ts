import type { IAlchemyItem } from '@churaverse/churaren-alchemy-plugin-server'
import { AlchemyItem } from '@churaverse/churaren-alchemy-plugin-server'
import type { ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-server'
import type { ICollidableEntity, IRectangle } from '@churaverse/collision-detection-plugin-server'
import type { WorldMap } from '@churaverse/map-plugin-server'
import type { Direction, Position, Vector } from 'churaverse-engine-server'

export const ICE_ARROW_WALK_LIMIT_GRIDS = 25
export const ICE_ARROW_WALK_LIMIT_MS = 2400
export const ICE_ARROW_ITEM: IAlchemyItem = {
  kind: 'iceArrow',
  recipe: {
    pattern: 'two_same_one_diff',
    materialKind: 'waterOre',
  },
}

/**
 * IceArrowクラスの定義
 */
export class IceArrow extends AlchemyItem implements ICollidableEntity, ChurarenWeaponEntity {
  public isCollidable = true
  public getRect(): IRectangle {
    return {
      width: 30,
      height: 30,
      position: this.position.copy(),
    }
  }

  public get id(): string {
    return this.iceArrowId
  }

  private _isDead = false
  public readonly iceArrowId: string
  public readonly churarenWeaponOwnerId: string
  public readonly spawnTime: number
  public readonly power = 20
  public readonly attackVector: Vector
  private _velocity: Vector

  public constructor(
    iceArrowId: string,
    ownerId: string,
    position: Position,
    direction: Direction,
    spawnTime: number,
    attackVector: Vector
  ) {
    super(iceArrowId, ICE_ARROW_ITEM.kind)
    this.iceArrowId = iceArrowId
    this.churarenWeaponOwnerId = ownerId
    this.position = position
    this.direction = direction
    this.spawnTime = spawnTime
    this.attackVector = attackVector

    // walkするまでは停止
    this._velocity = { x: 0, y: 0 }
  }

  public walk(worldMap: WorldMap): void {
    const moveDistance = ICE_ARROW_WALK_LIMIT_GRIDS * worldMap.gridSize
    const speed = moveDistance / ICE_ARROW_WALK_LIMIT_MS
    this._velocity = {
      x: this.attackVector.x * speed,
      y: this.attackVector.y * speed,
    }
  }

  public set isDead(_isDead: boolean) {
    this._isDead = _isDead
  }

  /**
   * isDeadがtrueでなくともスポーン後ICE_ARROW_WALK_LIMIT_MS経過している場合はfalseになる
   */
  public get isDead(): boolean {
    const now = Date.now()
    if (now - this.spawnTime >= ICE_ARROW_WALK_LIMIT_MS) {
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

declare module '@churaverse/churaren-alchemy-plugin-server' {
  export interface AlchemyItemKindMap {
    iceArrow: IceArrow
  }
}
