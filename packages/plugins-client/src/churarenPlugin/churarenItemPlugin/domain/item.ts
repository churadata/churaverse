import { Direction, Entity, type Position } from 'churaverse-engine-client'
import type { ItemKind } from './itemKind'

export class Item extends Entity {
  public itemId: string
  public spawnTime: number
  public kind: ItemKind

  public constructor(itemId: string, position: Position, spawnTime: number, kind: ItemKind) {
    super(position, Direction.down)
    this.itemId = itemId
    this.spawnTime = spawnTime
    this.kind = kind
  }
}
