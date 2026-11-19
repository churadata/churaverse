import type { Trap } from '../domain/trap'

export class TrapRepository {
  private readonly traps = new Map<string, Trap>()

  public set(id: string, entity: Trap): void {
    this.traps.set(id, entity)
  }

  public delete(id: string): void {
    this.traps.delete(id)
  }

  public get(id: string): Trap | undefined {
    return this.traps.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.traps.keys())
  }

  public clear(): void {
    this.traps.clear()
  }

  public get size(): number {
    return this.traps.size
  }
}
