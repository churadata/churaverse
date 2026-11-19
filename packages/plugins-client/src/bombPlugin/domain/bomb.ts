import { Direction, Entity, type Position, type WeaponEntity } from 'churaverse-engine-client'

/**
 * Bombクラス
 */
export class Bomb extends Entity implements WeaponEntity {
  public readonly power = 50
  public readonly timeLimit = 875
  public bombId: string
  public ownerId: string
  public spawnTime: number
  readonly id: string

  public constructor(bombId: string, ownerId: string, position: Position, _direction: Direction, spawnTime: number) {
    super(position, Direction.down)
    this.id = bombId
    this.bombId = bombId
    this.ownerId = ownerId
    this.spawnTime = spawnTime
  }

  public explode(): void {}

  // public attack(entity: Entity): void {
  //   entity.damage(this.power)
  // }
}
