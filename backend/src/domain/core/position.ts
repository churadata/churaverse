export class Position {
  private _x: number
  private _y: number
  private _gridX: number
  private _gridY: number

  public constructor(x: number, y: number) {
    this._x = x
    this._gridX = Math.round(x / 40)
    this._y = y
    this._gridY = Math.round(y / 40)
  }

  public get x(): number {
    return this._x
  }

  public set x(value: number) {
    this._x = value
    this._gridX = Math.round(value / 40)
  }

  public get y(): number {
    return this._y
  }

  public set y(value: number) {
    this._y = value
    this._gridY = Math.round(value / 40)
  }

  public get gridX(): number {
    return this._gridX
  }

  public set gridX(value: number) {
    this._gridX = value
    this._x = value * 40
  }

  public get gridY(): number {
    return this._gridY
  }

  public set gridY(value: number) {
    this._gridY = value
    this._y = value * 40
  }

  /**
   * グリッド座標に合わせる
   */
  public align(): Position {
    this._x = this._gridX * 40
    this._y = this._gridY * 40
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
