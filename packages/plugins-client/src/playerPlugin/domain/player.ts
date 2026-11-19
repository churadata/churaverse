import { type Direction, LivingEntity, type Position, WorldTime } from 'churaverse-engine-client'
import type { PlayerColor } from '../types/playerColor'
import type { PlayerRole } from '../types/playerRole'

/**
 * 1マス移動するのにかかる時間(ms)
 */
export const GRID_WALK_DURATION_MS = 320

/**
 * デフォルトのプレイヤーHP
 */
export const DEFAULT_HP = 100

/**
 * Playerクラス
 */
export class Player extends LivingEntity {
  public readonly id: string
  private _name: string
  private _color: PlayerColor
  private _role: PlayerRole

  private _isWalking = false
  public constructor(
    id: string,
    position: Position,
    direction: Direction,
    name: string,
    color: PlayerColor,
    hp: number,
    role: PlayerRole,
    public readonly spawnTime = WorldTime.now()
  ) {
    super(position, direction, hp)
    this.id = id
    this._name = name
    this._color = color
    this._role = role
  }

  /**
   * 死亡判定
   */
  public get isDead(): boolean {
    return this.hp <= 0
  }

  /**
   * 向きの変更
   * @param direction 変更後の向き
   */
  public turn(direction: Direction): void {
    this.direction = direction
  }

  public startWalk(): void {
    this._isWalking = true
  }

  /**
   * 歩行
   * @param position 歩行後の位置
   * @param direction 歩行後の向き
   */
  public walk(position: Position, _direction: Direction): void {
    this.position.x = position.x
    this.position.y = position.y
  }

  public stop(): void {
    this._isWalking = false
  }

  /**
   * 位置の変更
   */
  public teleport(position: Position): void {
    this.position = position
  }

  /**
   * ダメージを受ける処理
   * @param amount ダメージ数
   */
  public damage(amount: number): void {
    this.hp -= amount
  }

  /**
   * HPを回復する処理
   * @param healAmount 回復量
   */
  public heal(healAmount: number): void {
    this.hp = Math.min(this.hp + healAmount, DEFAULT_HP)
  }

  /**
   * Player復活の関数
   * @param position 復活時の位置
   */
  public respawn(position: Position, direction: Direction): void {
    this.turn(direction)
    this.teleport(position)
    this.hp = DEFAULT_HP
  }

  /**
   * Playerが終了したときの処理
   */
  public leave(): void {}

  /**
   * 名前変更
   * @param name 変更後の名前
   */
  public setName(name: string): void {
    this._name = name
  }

  public get name(): string {
    return this._name
  }

  /**
   * 色変更
   * @param colorName 変更後の色
   */
  public setColor(colorName: PlayerColor): void {
    this._color = colorName
  }

  public get color(): PlayerColor {
    return this._color
  }

  public get isWalking(): boolean {
    return this._isWalking
  }

  /**
   * roleの変更
   */
  public setRole(roleName: PlayerRole): void {
    this._role = roleName
  }

  public get role(): PlayerRole {
    return this._role
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
  const requiredKeys: Array<keyof Player> = ['id', 'position', 'direction', 'hp', 'spawnTime']
  const hasRequiredKeys = requiredKeys.every((key) => playerKeys.includes(key))

  return hasRequiredKeys
}
