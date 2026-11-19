import { Direction, Entity, Position } from 'churaverse-engine-client'

export class AlchemyItem extends Entity {
  public itemId: string
  public kind: string

  public constructor(itemId: string, kind: string) {
    super(new Position(0, 0), Direction.down)
    this.itemId = itemId
    this.kind = kind
  }
}
