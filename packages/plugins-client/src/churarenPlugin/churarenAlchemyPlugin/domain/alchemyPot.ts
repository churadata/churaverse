import { Direction, Entity, type Position } from 'churaverse-engine-client'

export class AlchemyPot extends Entity {
  public potId: string

  public constructor(potId: string, position: Position) {
    super(position, Direction.down)
    this.potId = potId
  }
}
