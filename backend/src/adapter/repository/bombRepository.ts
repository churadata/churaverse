import { IBombRepository } from '../../domain/IRepository/IBombRepository'
import { Bomb } from '../../domain/model/bomb'
import { CollidableEntityRepository } from '../../domain/core/collisionDetection/collidableEntityRepository'

export class BombRepository extends CollidableEntityRepository<Bomb> implements IBombRepository {
  private readonly bombs = new Map<string, Bomb>()

  public set(id: string, entity: Bomb): void {
    super.set(id, entity)
    this.bombs.set(id, entity)
  }

  public delete(id: string): void {
    super.delete(id)
    this.bombs.delete(id)
  }

  public get(id: string): Bomb | undefined {
    return this.bombs.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.bombs.keys())
  }
}
