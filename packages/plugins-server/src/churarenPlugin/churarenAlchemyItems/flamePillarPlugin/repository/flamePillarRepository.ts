import { CollidableEntityRepository } from '@churaverse/collision-detection-plugin-server'
import type { FlamePillar } from '../domain/flamePillar'
import type { IFlamePillarRepository } from '../domain/IFlamePillarRepository'

export class FlamePillarRepository extends CollidableEntityRepository<FlamePillar> implements IFlamePillarRepository {
  private readonly flamePillars = new Map<string, FlamePillar>()

  public set(id: string, entity: FlamePillar): void {
    super.set(id, entity)
    this.flamePillars.set(id, entity)
  }

  public delete(id: string): void {
    super.delete(id)
    this.flamePillars.delete(id)
  }

  public get(id: string): FlamePillar | undefined {
    return this.flamePillars.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.flamePillars.keys())
  }
}
