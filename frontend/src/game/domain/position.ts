import { GRID_SIZE } from './worldConfig'

/** 位置型 */
export class Position {
  private _x: number
  private _y: number
  private _gridX: number
  private _gridY: number

  public constructor(x: number, y: number) {
    this._x = x
    this._gridX = Math.round(x / GRID_SIZE)
    this._y = y
    this._gridY = Math.round(y / GRID_SIZE)
  }

  public get x(): number {
    return this._x
  }

  public set x(value: number) {
    this._x = value
    this._gridX = Math.round(value / GRID_SIZE)
  }

  public get y(): number {
    return this._y
  }

  public set y(value: number) {
    this._y = value
    this._gridY = Math.round(value / GRID_SIZE)
  }

  public get gridX(): number {
    return this._gridX
  }

  public set gridX(value: number) {
    this._gridX = value
    this._x = value * GRID_SIZE
  }

  public get gridY(): number {
    return this._gridY
  }

  public set gridY(value: number) {
    this._gridY = value
    this._y = value * GRID_SIZE
  }

  /**
   * グリッド座標に合わせる
   */
  public align(): Position {
    this._x = this._gridX * GRID_SIZE
    this._y = this._gridY * GRID_SIZE
    return this
  }

  /**
   * グリッドの中心の座標に合わせる
   */
  public alignCenter(): Position {
    this.align()
    this._x += GRID_SIZE / 2
    this._y += GRID_SIZE / 2
    return this
  }

  /**
   * Positionを複製する
   */
  public copy(): Position {
    return new Position(this._x, this._y)
  }

  /**
   * 引数のPositionとの距離を求める
   * @param oppositePos 反対側Position
   * @returns 距離
   */
  public distanceTo(oppositePos: Position): number {
    return Math.sqrt(Math.pow(this._x - oppositePos.x, 2) + Math.pow(this._y - oppositePos.y, 2))
  }
}
