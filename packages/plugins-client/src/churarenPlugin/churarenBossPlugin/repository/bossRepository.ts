import type { Boss } from '../domain/boss'

export class BossRepository {
  private readonly bosses = new Map<string, Boss>()

  public set(id: string, entity: Boss): void {
    this.bosses.set(id, entity)
  }

  public delete(id: string): void {
    this.bosses.delete(id)
  }

  public get(id: string): Boss | undefined {
    return this.bosses.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.bosses.keys())
  }

  public get size(): number {
    return this.bosses.size
  }

  public clear(): void {
    this.bosses.clear()
  }
}
