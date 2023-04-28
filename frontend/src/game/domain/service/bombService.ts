import { Bomb } from '../model/bomb'
import { Entity } from '../model/entity'

/**
 * Bombのインスタンスを格納する場所
 */
export class BombService {
  public bombs = new Map<string, Bomb>()

  /**
   * Bombの生成
   * @param id Bombのid
   * @param bomb Bomb
   */
  public drop(id: string, bomb: Bomb): void {
    this.bombs.set(id, bomb)
  }

  /**
   * Bombの爆発
   * @param id Bombのid
   */
  public explode(id: string): void {
    this.bombs.get(id)?.explode()
    this.bombs.delete(id)
  }

  public attack(id: string, entity: Entity): void {
    this.bombs.get(id)?.attack(entity)
  }
}
