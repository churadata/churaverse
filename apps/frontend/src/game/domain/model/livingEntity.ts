import { Direction } from './core/direction'
import { Position } from './core/position'
import { Entity } from './entity'

/**
 * マップ上の生きているものの基底クラス
 */
export abstract class LivingEntity extends Entity {
  public hp: number

  public constructor(position: Position, direction: Direction, hp = 100) {
    super(position, direction)
    this.hp = hp
  }

  public damage(amount: number): void {}
}
