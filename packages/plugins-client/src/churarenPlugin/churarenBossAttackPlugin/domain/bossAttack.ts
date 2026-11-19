import { type Direction, Entity, GRID_SIZE, type Position } from 'churaverse-engine-client'

export const CHURAREN_BOSS_ATTACK_LIMIT_GRIDS = 25
export const CHURAREN_BOSS_ATTACK_LIMIT_MS = 5000
export const CHURAREN_BOSS_ATTACK_SPEED = (CHURAREN_BOSS_ATTACK_LIMIT_GRIDS * GRID_SIZE) / CHURAREN_BOSS_ATTACK_LIMIT_MS

/**
 * ChurarenBossAttackクラス
 */
export class BossAttack extends Entity {
  public readonly power = 30
  public isDead = false
  public bossAttackId: string
  public churarenWeaponOwnerId: string
  public spawnTime: number

  public constructor(
    bossAttackId: string,
    ownerId: string,
    position: Position,
    direction: Direction,
    spawnTime: number
  ) {
    super(position, direction)
    this.bossAttackId = bossAttackId
    this.churarenWeaponOwnerId = ownerId
    this.spawnTime = spawnTime
  }

  /**
   * 移動
   * @param position 宛先
   */
  public move(position: Position): void {
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
