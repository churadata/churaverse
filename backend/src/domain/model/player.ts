import { ICollidableEntity } from '../core/collisionDetection/collidableEntity/ICollidableEntity'
import { IRectangle } from '../core/collisionDetection/collidableEntity/IRectangle'
import { Direction } from '../core/direction'
import { Position } from '../core/position'
import { Vector } from '../core/vector'

export const PLAYER_COLOR_NAMES = ['basic', 'red', 'black', 'blue', 'gray']
export type PlayerColorName = typeof PLAYER_COLOR_NAMES[number]
export const PLAYER_RESPAWN_WAITING_TIME_MS = 2500

export class Player implements ICollidableEntity {
  public isCollidable = true

  public getRect(): IRectangle {
    return {
      width: this._width,
      height: this._height,
      position: this.position.copy(),
    }
  }

  private _position: Position
  private _direction: Direction = Direction.down
  private _hp = 100
  private _color: PlayerColorName = 'basic'
  private _name = 'name'
  private _velocity: Vector = { x: 0, y: 0 }
  private readonly _width = 34
  private readonly _height = 40

  public constructor(position: Position, direction: Direction) {
    this._position = position
    this._direction = direction
  }

  public get position(): Position {
    return this._position
  }

  public get direction(): Direction {
    return this._direction
  }

  public get hp(): number {
    return this._hp
  }

  public get color(): PlayerColorName {
    return this._color
  }

  public get name(): string {
    return this._name
  }

  public get velocity(): Vector {
    return this._velocity
  }

  public get isDead(): boolean {
    return this._hp <= 0
  }

  public turn(direction: Direction): void {
    this._direction = direction
  }

  public walk(position: Position, direction: Direction, velocity: Vector): void {
    this._position.x = position.x
    this._position.y = position.y
    this._direction = direction
    this._velocity = velocity
  }

  public stop(): void {
    this._velocity = { x: 0, y: 0 }
  }

  public teleport(position: Position): void {
    this._direction = Direction.down
    this._position = position
  }

  public damage(amount: number): void {
    this._hp -= amount
  }

  public respawn(position: Position): void {
    this.teleport(position)
    this._hp = 100
  }

  public setPlayerName(name: string): void {
    this._name = name
  }

  public setPlayerColor(colorName: PlayerColorName): void {
    this._color = colorName
  }

  /**
   * 微小時間dtだけ速度に応じて位置を更新
   */
  public move(dt: number): void {
    this._position.x += this._velocity.x * dt
    this._position.y += this._velocity.y * dt
  }
}
