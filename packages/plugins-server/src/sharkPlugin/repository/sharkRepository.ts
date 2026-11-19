import { CollidableEntityRepository } from '@churaverse/collision-detection-plugin-server'
import type { ISharkRepository } from '../domain/ISharkRepository'
import type { Shark } from '../domain/shark'

export class SharkRepository extends CollidableEntityRepository<Shark> implements ISharkRepository {
  private readonly sharks = new Map<string, Shark>()

  public set(id: string, entity: Shark): void {
    super.set(id, entity)
    this.sharks.set(id, entity)
  }

  public delete(id: string): void {
    super.delete(id)
    this.sharks.delete(id)
  }

  public get(id: string): Shark | undefined {
    return this.sharks.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.sharks.keys())
  }
}
