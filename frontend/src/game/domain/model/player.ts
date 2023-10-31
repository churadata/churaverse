import { Direction } from './core/direction'
import { Position } from './core/position'
import { Entity } from './entity'
import { PlayerColorName, PlayerRoleName } from './types'

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
export class Player extends Entity {
  private _name: string
  private _color: PlayerColorName
  private _role: PlayerRoleName

  private _isWalking = false
  public constructor(
    position: Position,
    direction: Direction,
    name: string,
    color: PlayerColorName,
    hp: number,
    role: PlayerRoleName
  ) {
    super(position, direction, hp)
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
  public walk(position: Position, direction: Direction): void {
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
  public setColor(colorName: PlayerColorName): void {
    this._color = colorName
  }

  public get color(): PlayerColorName {
    return this._color
  }

  public get isWalking(): boolean {
    return this._isWalking
  }

  /**
   * roleの変更
   */
  public setRole(roleName: PlayerRoleName): void {
    this._role = roleName
  }

  public get role(): PlayerRoleName {
    return this._role
  }
}
