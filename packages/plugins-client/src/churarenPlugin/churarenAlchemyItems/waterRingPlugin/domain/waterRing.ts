import type { AlchemyItemKind, IAlchemyItem } from '@churaverse/churaren-alchemy-plugin-client'
import { AlchemyItem } from '@churaverse/churaren-alchemy-plugin-client'
import type { ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-client'
import type { Direction, Position } from 'churaverse-engine-client'
import waterRingImage from '../assets/waterRing.gif'

export const waterRing: AlchemyItemKind = 'waterRing'
export const WATER_RING_ITEM: IAlchemyItem = {
  kind: 'waterRing',
  image: waterRingImage,
} as const

/**
 * waterRingクラスの定義
 */
export class WaterRing extends AlchemyItem implements ChurarenWeaponEntity {
  public readonly power = 25
  public isDead = false
  public waterRingId: string
  public churarenWeaponOwnerId: string
  public spawnTime: number

  public constructor(
    waterRingId: string,
    ownerId: string,
    position: Position,
    direction: Direction,
    spawnTime: number
  ) {
    super(waterRingId, 'waterRing')
    this.waterRingId = waterRingId
    this.churarenWeaponOwnerId = ownerId
    this.position = position
    this.spawnTime = spawnTime
    this.direction = direction
  }

  /**
   * 消滅
   */
  public die(): void {
    this.isDead = true
  }
}

declare module '@churaverse/churaren-alchemy-plugin-client' {
  export interface AlchemyItemKindMap {
    waterRing: WaterRing
  }
}
