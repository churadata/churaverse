import type { IAlchemyItem } from '@churaverse/churaren-alchemy-plugin-server'
import { AlchemyItem } from '@churaverse/churaren-alchemy-plugin-server'
import type { ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-server'
import type { ICollidableEntity, IRectangle } from '@churaverse/collision-detection-plugin-server'
import type { Direction, Position } from 'churaverse-engine-server'

export const TRAP_ITEM: IAlchemyItem = {
  kind: 'trap',
  recipe: {
    pattern: 'two_same_one_diff',
    materialKind: 'grassOre',
  },
}

export class Trap extends AlchemyItem implements ICollidableEntity, ChurarenWeaponEntity {
  public isCollidable = true
  public getRect(): IRectangle {
    return {
      width: this.SIDE_LENGTH,
      height: this.SIDE_LENGTH,
      position: this.position.copy(),
    }
  }

  public get id(): string {
    return this.trapId
  }

  private _isDead = false
  public readonly trapId: string
  public readonly churarenWeaponOwnerId: string
  public readonly power = 50
  public readonly spawnTime: number

  private readonly SIDE_LENGTH = 70

  public constructor(trapId: string, ownerId: string, position: Position, direction: Direction, spawnTime: number) {
    super(trapId, TRAP_ITEM.kind)
    this.trapId = trapId
    this.churarenWeaponOwnerId = ownerId
    this.spawnTime = spawnTime
    this.position = position
    this.direction = direction
  }

  public set isDead(_isDead: boolean) {
    this._isDead = _isDead
  }

  public get isDead(): boolean {
    return this._isDead
  }

  public die(): void {
    this._isDead = true
    this.isCollidable = false
  }
}

declare module '@churaverse/churaren-alchemy-plugin-server' {
  export interface AlchemyItemKindMap {
    trap: Trap
  }
}
