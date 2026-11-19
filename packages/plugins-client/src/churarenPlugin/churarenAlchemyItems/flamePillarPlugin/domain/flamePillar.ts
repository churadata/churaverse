import type { IAlchemyItem } from '@churaverse/churaren-alchemy-plugin-client'
import { AlchemyItem } from '@churaverse/churaren-alchemy-plugin-client'
import type { ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-client'
import type { Direction, Position } from 'churaverse-engine-client'
import flamePillarImage from '../assets/flamePillar.gif'

export const FLAME_PILLAR_ITEM: IAlchemyItem = {
  kind: 'flamePillar',
  image: flamePillarImage,
} as const

/**
 * FlamePillarクラスの定義
 */
export class FlamePillar extends AlchemyItem implements ChurarenWeaponEntity {
  public readonly power = 50
  public flamePillarId: string
  public churarenWeaponOwnerId: string
  public spawnTime: number

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
}

declare module '@churaverse/churaren-alchemy-plugin-client' {
  export interface AlchemyItemKindMap {
    flamePillar: FlamePillar
  }
}
