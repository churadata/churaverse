import { Player } from '../../domain/model/player'
import { IPlayerRepository } from '../../domain/IRepository/IPlayerRepository'
import { CollidableEntityRepository } from '../../domain/core/collisionDetection/collidableEntityRepository'

export class PlayerRepository
  extends CollidableEntityRepository<Player>
  implements IPlayerRepository
{
  private readonly players = new Map<string, Player>()

  public set(id: string, entity: Player): void {
    super.set(id, entity)
    this.players.set(id, entity)
  }

  public delete(id: string): void {
    super.delete(id)
    this.players.delete(id)
  }

  public get(id: string): Player | undefined {
    return this.players.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.players.keys())
  }
}
