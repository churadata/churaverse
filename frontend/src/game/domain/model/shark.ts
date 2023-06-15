import { GRID_SIZE } from '../worldConfig'
import { Direction } from './core/direction'
import { Position } from './core/position'
import { Entity } from './entity'
import { Player } from './player'

export const SHARK_WALK_LIMIT_GRIDS = 25
export const SHARK_WALK_LIMIT_MS = 1600
export const SHARK_SPEED = (SHARK_WALK_LIMIT_GRIDS * GRID_SIZE) / SHARK_WALK_LIMIT_MS

/**
 * Sharkクラス
 */
export class Shark extends Entity {
  public source: Player
  public isDead = false
  public spawnTime: number

  public constructor(source: Player, position: Position, direction: Direction, spawnTime: number) {
    super(position, direction)
    this.source = source
    this.spawnTime = spawnTime
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
