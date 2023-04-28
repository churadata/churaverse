import { Direction } from '../direction'
import { Position } from '../position'
import { Entity } from './entity'
import { PlayerColorName, PLAYER_COLOR_NAMES } from './types'

/**
 * 1マス移動するのにかかる時間(ms)
 */
export const GRID_WALK_DURATION_MS = 320

/**
 * Playerクラス
 */
export class Player extends Entity {
  private _name = 'name'
  private _color: PlayerColorName = PLAYER_COLOR_NAMES[0]

  private _isWalking = false

  public constructor(position: Position, direction: Direction) {
    super(position, direction, 100)
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
    this.direction = Direction.down
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
  public respawn(position: Position): void {
    this.teleport(position)
    this.hp = 100
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
}
