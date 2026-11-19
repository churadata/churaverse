import type { IAlchemyItem } from '@churaverse/churaren-alchemy-plugin-client'
import { AlchemyItem } from '@churaverse/churaren-alchemy-plugin-client'
import type { Direction, Position } from 'churaverse-engine-client'
import healingPotionImage from '../assets/healingPotion.png'

export const HEALING_POTION_ITEM: IAlchemyItem = {
  kind: 'healingPotion',
  image: healingPotionImage,
}

/**
 * 回復アイテムの定義
 */
export class HealingPotion extends AlchemyItem {
  public readonly heal = 50
  public isDead = false
  public healingPotionId: string
  public ownerId: string
  public spawnTime: number

  public constructor(
    healingPotionId: string,
    ownerId: string,
    position: Position,
    direction: Direction,
    spawnTime: number
  ) {
    super(healingPotionId, HEALING_POTION_ITEM.kind)
    this.healingPotionId = healingPotionId
    this.ownerId = ownerId
    this.position = position
    this.spawnTime = spawnTime
    this.direction = direction
  }

  /**
   * 移動
   * @param position 宛先
   */
  public walk(position: Position): void {
    this.position.x = position.x
    this.position.y = position.y
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
    healingPotion: HealingPotion
  }
}
