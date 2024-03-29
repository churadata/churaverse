import { Direction } from './core/direction'
import { Position } from './core/position'

/**
 * マップ上の動くもの基底クラス
 */
export abstract class Entity {
  public position: Position
  public direction: Direction
  public hp: number

  public constructor(position: Position, direction: Direction, hp = 100) {
    this.position = position
    this.direction = direction
    this.hp = hp
  }

  public damage(amount: number): void {}

  public die(): void {}
}
