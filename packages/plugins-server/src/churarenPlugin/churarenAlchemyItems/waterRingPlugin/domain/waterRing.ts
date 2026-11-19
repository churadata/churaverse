import type { IAlchemyItem } from '@churaverse/churaren-alchemy-plugin-server'
import { AlchemyItem } from '@churaverse/churaren-alchemy-plugin-server'
import type { ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-server'
import type { ICollidableEntity, IRectangle } from '@churaverse/collision-detection-plugin-server'
import type { Direction, Position } from 'churaverse-engine-server'

const WATER_RING_SPAWN_LIMIT_MS = 5000
export const WATER_RING_ITEM: IAlchemyItem = {
  kind: 'waterRing',
  recipe: {
    pattern: 'all_same',
    materialKind: 'waterOre',
  },
}

export class WaterRing extends AlchemyItem implements ICollidableEntity, ChurarenWeaponEntity {
  public isCollidable = true
  public getRect(): IRectangle {
    return {
      width: this._width,
      height: this._height,
      position: this.position.copy(),
    }
  }

  public get id(): string {
    return this.waterRingId
  }

  private _isDead = false
  public readonly waterRingId: string
  public readonly churarenWeaponOwnerId: string
  public readonly power = 25
  public readonly spawnTime: number
  public lastHitTime: number = 0 // 最後にヒットした時間
  private readonly hitCooldown: number = 1000 // クールダウンの時間（ミリ秒）

  private readonly SIDE_LENGTH = 200
  private readonly _width: number = this.SIDE_LENGTH
  private readonly _height: number = this.SIDE_LENGTH

  public constructor(
    waterRingId: string,
    ownerId: string,
    position: Position,
    direction: Direction,
    spawnTime: number
  ) {
    super(waterRingId, WATER_RING_ITEM.kind)
    this.waterRingId = waterRingId
    this.churarenWeaponOwnerId = ownerId
    this.spawnTime = spawnTime
    this.lastHitTime = 0
    this.position = position
    this.direction = direction
  }

  public startCooldown(): void {
    this.isCollidable = false
    this.lastHitTime = Date.now()
  }

  public updateCooldown(): void {
    if (!this.isCollidable && Date.now() - this.lastHitTime >= this.hitCooldown) {
      this.isCollidable = true
    }
  }

  public set isDead(_isDead: boolean) {
    this._isDead = _isDead
  }

  public get isDead(): boolean {
    const now = Date.now()
    if (now - this.spawnTime >= WATER_RING_SPAWN_LIMIT_MS) {
      this._isDead = true
    }
    return this._isDead
  }

  public die(): void {
    this._isDead = true
    this.isCollidable = false
  }
}

declare module '@churaverse/churaren-alchemy-plugin-server' {
  export interface AlchemyItemKindMap {
    waterRing: WaterRing
  }
}
