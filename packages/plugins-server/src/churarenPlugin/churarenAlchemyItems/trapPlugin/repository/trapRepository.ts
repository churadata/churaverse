import { CollidableEntityRepository } from '@churaverse/collision-detection-plugin-server'
import type { ITrapRepository } from '../domain/ITrapRepository'
import type { Trap } from '../domain/trap'

export class TrapRepository extends CollidableEntityRepository<Trap> implements ITrapRepository {
  private readonly traps = new Map<string, Trap>()

  public set(id: string, entity: Trap): void {
    super.set(id, entity)
    this.traps.set(id, entity)
  }

  public delete(id: string): void {
    super.delete(id)
    this.traps.delete(id)
  }

  public get(id: string): Trap | undefined {
    return this.traps.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.traps.keys())
  }
}
