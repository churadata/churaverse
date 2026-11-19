import { type Direction, Entity, GRID_SIZE, type Position, type WeaponEntity } from 'churaverse-engine-client'

export const SHARK_WALK_LIMIT_GRIDS = 25
export const SHARK_WALK_LIMIT_MS = 2400
export const SHARK_SPEED = (SHARK_WALK_LIMIT_GRIDS * GRID_SIZE) / SHARK_WALK_LIMIT_MS

/**
 * Sharkクラス
 */
export class Shark extends Entity implements WeaponEntity {
  public readonly power = 20
  public isDead = false
  public sharkId: string
  public ownerId: string
  public spawnTime: number
  readonly id: string

  public constructor(sharkId: string, ownerId: string, position: Position, direction: Direction, spawnTime: number) {
    super(position, direction)
    this.id = sharkId
    this.sharkId = sharkId
    this.ownerId = ownerId
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
