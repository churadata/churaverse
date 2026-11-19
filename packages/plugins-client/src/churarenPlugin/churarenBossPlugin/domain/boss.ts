import { Direction, LivingEntity, type Position } from 'churaverse-engine-client'

export class Boss extends LivingEntity {
  public bossId: string
  public spawnTime: number
  public readonly power = 40

  public constructor(bossId: string, position: Position, spawnTime: number, hp: number) {
    super(position, Direction.down, hp)
    this.bossId = bossId
    this.spawnTime = spawnTime
  }

  /**
   * ボスのダメージ処理
   * @param amount ダメージ量
   */
  public damage(amount: number): void {
    this.hp -= amount
  }

  /**
   * ボスの移動
   * @param position 移動先の座標
   */
  public walk(position: Position, _direction: Direction): void {
    this.position.x = position.x
    this.position.y = position.y
  }
}
