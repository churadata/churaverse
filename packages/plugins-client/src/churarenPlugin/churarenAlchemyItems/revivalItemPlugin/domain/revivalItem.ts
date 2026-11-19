import type { IAlchemyItem } from '@churaverse/churaren-alchemy-plugin-client'
import { AlchemyItem } from '@churaverse/churaren-alchemy-plugin-client'
import type { Direction, Position } from 'churaverse-engine-client'
import revivalItemImage from '../assets/revivalItem.png'

export const REVIVAL_ITEM: IAlchemyItem = {
  kind: 'revivalItem',
  image: revivalItemImage,
}

/**
 * 復活アイテムの定義
 */
export class RevivalItem extends AlchemyItem {
  public isDead = false
  public revivalItemId: string
  public ownerId: string
  public spawnTime: number

  public constructor(
    revivalItemId: string,
    ownerId: string,
    position: Position,
    direction: Direction,
    spawnTime: number
  ) {
    super(revivalItemId, REVIVAL_ITEM.kind)
    this.revivalItemId = revivalItemId
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
    revivalItem: RevivalItem
  }
}
