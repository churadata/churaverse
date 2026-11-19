import type { IAlchemyItem } from '@churaverse/churaren-alchemy-plugin-client'
import { AlchemyItem } from '@churaverse/churaren-alchemy-plugin-client'
import type { ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-client'
import { type Direction, GRID_SIZE, type Position } from 'churaverse-engine-client'
import blackHoleImage from '../assets/blackHole.gif'

export const BLACK_HOLE_MOVE_LIMIT_GRIDS = 2
export const BLACK_HOLE_MOVE_LIMIT_MS = 1500
export const BLACK_HOLE_SPEED = (BLACK_HOLE_MOVE_LIMIT_GRIDS * GRID_SIZE) / BLACK_HOLE_MOVE_LIMIT_MS
export const BLACK_HOLE_ITEM: IAlchemyItem = {
  kind: 'blackHole',
  image: blackHoleImage,
} as const

/**
 * blackHoleクラスの定義
 */
export class BlackHole extends AlchemyItem implements ChurarenWeaponEntity {
  public readonly power = 20
  public isDead = false
  public blackHoleId: string
  public spawnTime: number
  public churarenWeaponOwnerId: string

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
    this.position = position
    this.spawnTime = spawnTime
    this.direction = direction
  }
}

declare module '@churaverse/churaren-alchemy-plugin-client' {
  export interface AlchemyItemKindMap {
    blackHole: BlackHole
  }
}
