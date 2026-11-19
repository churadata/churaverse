import type { FlamePillar } from '../domain/flamePillar'

export class FlamePillarRepository {
  private readonly flamePillars = new Map<string, FlamePillar>()

  public set(id: string, entity: FlamePillar): void {
    this.flamePillars.set(id, entity)
  }

  public delete(id: string): void {
    this.flamePillars.delete(id)
  }

  public get(id: string): FlamePillar | undefined {
    return this.flamePillars.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.flamePillars.keys())
  }

  public get size(): number {
    return this.flamePillars.size
  }
}
