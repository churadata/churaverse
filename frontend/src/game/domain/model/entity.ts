import { Direction } from './core/direction'
import { Position } from './core/position'

/**
 * マップ上の動くもの基底クラス
 */
export abstract class Entity {
  public position: Position
  public direction: Direction

  public constructor(position: Position, direction: Direction) {
    this.position = position
    this.direction = direction
  }

  public die(): void {}
}
