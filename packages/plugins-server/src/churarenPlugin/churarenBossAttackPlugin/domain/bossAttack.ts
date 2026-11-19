import type { ICollidableEntity, IRectangle } from '@churaverse/collision-detection-plugin-server'
import type { WorldMap } from '@churaverse/map-plugin-server'
import { type Direction, Entity, type Position, type Vector } from 'churaverse-engine-server'

export const CHURAREN_BOSS_ATTACK_LIMIT_GRIDS = 25
export const CHURAREN_BOSS_ATTACK_LIMIT_MS = 5000
const CHURAREN_BOSS_ATTACK_SIZE = 100

/**
 * ChurarenBossAttackクラス
 */
export class BossAttack extends Entity implements ICollidableEntity {
  public isCollidable = true
  public getRect(): IRectangle {
    return {
      width: CHURAREN_BOSS_ATTACK_SIZE,
      height: CHURAREN_BOSS_ATTACK_SIZE,
      position: this.position.copy(),
    }
  }

  public get id(): string {
    return this.bossAttackId
  }

  // BossAttackのプロパティ
  public readonly power = 30
  private _isDead = false
  public readonly bossAttackId: string
  public churarenWeaponOwnerId: string
  public readonly spawnTime: number
  private _velocity: Vector

  public constructor(
    bossAttackId: string,
    ownerId: string,
    position: Position,
    direction: Direction,
    spawnTime: number
  ) {
    super(position, direction)

    this.position = position
    this.direction = direction
    this.bossAttackId = bossAttackId
    this.spawnTime = spawnTime
    this.churarenWeaponOwnerId = ownerId

    // attackするまでは停止
    this._velocity = { x: 0, y: 0 }
  }

  public ignition(worldMap: WorldMap): void {
    const moveDistance = CHURAREN_BOSS_ATTACK_LIMIT_GRIDS * worldMap.gridSize
    const speed = moveDistance / CHURAREN_BOSS_ATTACK_LIMIT_MS
    this._velocity = {
      x: this.direction.x * speed,
      y: this.direction.y * speed,
    }
  }

  public set isDead(_isDead: boolean) {
    this._isDead = _isDead
  }

  public get isDead(): boolean {
    const now = Date.now()
    if (now - this.spawnTime > CHURAREN_BOSS_ATTACK_LIMIT_MS) {
      this._isDead = true
    }
    return this._isDead
  }

  public die(): void {
    this._isDead = true
    this.isCollidable = false
  }

  public move(dt: number): void {
    this.position.x += this._velocity.x * dt
    this.position.y += this._velocity.y * dt
  }
}

export function isBossAttack(entity: Entity): entity is BossAttack {
  if (!(entity instanceof Entity)) return false
  const bossKeys = Object.keys(entity) as Array<keyof BossAttack>
  const requiredKeys: Array<keyof BossAttack> = ['bossAttackId', 'spawnTime', 'power', 'isCollidable']
  return requiredKeys.every((key) => bossKeys.includes(key))
}
