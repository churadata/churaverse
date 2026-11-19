import type { IAlchemyItem } from '@churaverse/churaren-alchemy-plugin-server'
import { AlchemyItem } from '@churaverse/churaren-alchemy-plugin-server'
import type { ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-server'
import type { ICollidableEntity, IRectangle } from '@churaverse/collision-detection-plugin-server'
import type { Direction, Position } from 'churaverse-engine-server'

export const FLAME_PILLAR_SPAWN_LIMIT_MS = 10000
export const FLAME_PILLAR_ITEM: IAlchemyItem = {
  kind: 'flamePillar',
  recipe: {
    pattern: 'all_same',
    materialKind: 'fireOre',
  },
}

export class FlamePillar extends AlchemyItem implements ICollidableEntity, ChurarenWeaponEntity {
  public isCollidable = true
  public getRect(): IRectangle {
    return {
      width: this.FLAME_PILLAR_SIZE,
      height: this.FLAME_PILLAR_SIZE,
      position: this.position.copy(),
    }
  }

  public get id(): string {
    return this.flamePillarId
  }

  private _isDead = false
  public readonly flamePillarId: string
  public readonly churarenWeaponOwnerId: string
  public readonly power = 50
  public readonly spawnTime: number

  private readonly FLAME_PILLAR_SIZE = 70

  public constructor(
    flamePillarId: string,
    ownerId: string,
    position: Position,
    direction: Direction,
    spawnTime: number
  ) {
    super(flamePillarId, FLAME_PILLAR_ITEM.kind)
    this.flamePillarId = flamePillarId
    this.churarenWeaponOwnerId = ownerId
    this.spawnTime = spawnTime
    this.position = position
    this.direction = direction
  }

  public get isDead(): boolean {
    const now = Date.now()
    if (now - this.spawnTime >= FLAME_PILLAR_SPAWN_LIMIT_MS) {
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
    flamePillar: FlamePillar
  }
}
