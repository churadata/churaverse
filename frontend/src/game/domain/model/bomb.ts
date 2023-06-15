import { Player } from './player'
import { Entity } from './entity'
import { Direction } from './core/direction'
import { Position } from './core/position'

/**
 * Bombクラス
 */
export class Bomb extends Entity {
  public source: Player
  public readonly power = 50
  public readonly timeLimit = 875

  public constructor(source: Player, position: Position) {
    super(position, Direction.down)
    this.source = source
  }

  public explode(): void {}

  public attack(entity: Entity): void {
    entity.damage(this.power)
  }
}
