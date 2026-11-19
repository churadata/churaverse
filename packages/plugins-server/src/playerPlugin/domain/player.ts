import type { ICollidableEntity, IRectangle } from '@churaverse/collision-detection-plugin-server'
import { Direction, LivingEntity, type Position, type Vector, WorldTime } from 'churaverse-engine-server'
import type { PlayerColor } from '../types/playerColor'
import type { PlayerRole } from '../types/playerRole'

export const PLAYER_RESPAWN_WAITING_TIME_MS = 2500
export const RESPAWN_INVINCIBLE_TIME_MS = 3000 // リスポーン後の無敵時間

/**
 * PlayerのデフォルトHP
 */
export const DEFAULT_HP = 100

export class Player extends LivingEntity implements ICollidableEntity {
  public isCollidable = true

  public getRect(): IRectangle {
    return {
      width: this._width,
      height: this._height,
      position: this.position.copy(),
    }
  }

  private _color: PlayerColor = 'basic'
  private _name = 'name'
  private _velocity: Vector = { x: 0, y: 0 }
  private readonly _width = 34
  private readonly _height = 40
  public readonly role: PlayerRole
  private invincibleEndTime: number = 0

  public constructor(
    public readonly id: string,
    position: Position,
    direction: Direction,
    name: string,
    color: PlayerColor,
    hp: number,
    role: PlayerRole,
    public readonly spawnTime = WorldTime.now()
  ) {
    super(position, direction, hp)
    this._name = name
    this._color = color
    this.role = role
  }

  public get color(): PlayerColor {
    return this._color
  }

  public get name(): string {
    return this._name
  }

  public get velocity(): Vector {
    return this._velocity
  }

  public get isDead(): boolean {
    return this.hp <= 0
  }

  public get isInvincible(): boolean {
    return Date.now() < this.invincibleEndTime
  }

  public turn(direction: Direction): void {
    this.direction = direction
  }

  public walk(position: Position, direction: Direction, velocity: Vector): void {
    this.position.x = position.x
    this.position.y = position.y
    this.direction = direction
    this._velocity = velocity
  }

  public stop(): void {
    this._velocity = { x: 0, y: 0 }
  }

  public teleport(position: Position): void {
    this.direction = Direction.down
    this.position = position
  }

  public damage(amount: number): void {
    this.hp -= amount
  }

  public heal(amount: number): void {
    this.hp = Math.min(this.hp + amount, DEFAULT_HP)
  }

  public respawn(position: Position, duration: number = RESPAWN_INVINCIBLE_TIME_MS): void {
    this.teleport(position)
    this.hp = DEFAULT_HP
    this.invincibleEndTime = Date.now() + duration
  }

  public setPlayerName(name: string): void {
    this._name = name
  }

  public setPlayerColor(colorName: PlayerColor): void {
    this._color = colorName
  }

  /**
   * 微小時間dtだけ速度に応じて位置を更新
   */
  public move(dt: number): void {
    this.position.x += this._velocity.x * dt
    this.position.y += this._velocity.y * dt
  }
}

/**
 * 外部Pluginから型チェックするためのユーザー定義型ガード関数
 */
export function isPlayer(data: unknown): data is Player {
  if (data == null) {
    return false
  }

  // dataを一旦 Object.entriesみたいにして、dataのキーがPlayerのキーとあっているか確認する
  const playerKeys = Object.keys(data) as Array<keyof Player>
  const requiredKeys: Array<keyof Player> = ['id', 'role', 'spawnTime', 'isCollidable']
  const hasRequiredKeys = requiredKeys.every((key) => playerKeys.includes(key))

  return hasRequiredKeys
}
