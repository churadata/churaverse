import { CollidableEntityRepository } from '@churaverse/collision-detection-plugin-server'
import type { AlchemyPot } from '../domain/alchemyPot'
import type { IAlchemyPotRepository } from '../domain/IAlchemyPotRepository'

export class AlchemyPotRepository extends CollidableEntityRepository<AlchemyPot> implements IAlchemyPotRepository {
  private readonly alchemyPots = new Map<string, AlchemyPot>()

  public set(id: string, entity: AlchemyPot): void {
    super.set(id, entity)
    this.alchemyPots.set(id, entity)
  }

  public delete(id: string): void {
    super.delete(id)
    this.alchemyPots.delete(id)
  }

  public get(id: string): AlchemyPot | undefined {
    return this.alchemyPots.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.alchemyPots.keys())
  }

  public clear(): void {
    this.alchemyPots.clear()
  }
}
