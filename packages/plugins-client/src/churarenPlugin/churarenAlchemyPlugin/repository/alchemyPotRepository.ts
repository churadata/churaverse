import type { AlchemyPot } from '../domain/alchemyPot'

export class AlchemyPotRepository {
  private readonly alchemies = new Map<string, AlchemyPot>()

  public set(id: string, entity: AlchemyPot): void {
    this.alchemies.set(id, entity)
  }

  public delete(id: string): void {
    this.alchemies.delete(id)
  }

  public get(id: string): AlchemyPot | undefined {
    return this.alchemies.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.alchemies.keys())
  }

  public clear(): void {
    this.alchemies.clear()
  }

  public get size(): number {
    return this.alchemies.size
  }
}
