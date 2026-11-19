import type { BlackHole } from '../domain/blackHole'

export class BlackHoleRepository {
  private readonly blackHoles = new Map<string, BlackHole>()

  public set(id: string, entity: BlackHole): void {
    this.blackHoles.set(id, entity)
  }

  public delete(id: string): void {
    this.blackHoles.delete(id)
  }

  public get(id: string): BlackHole | undefined {
    return this.blackHoles.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.blackHoles.keys())
  }

  public clear(): void {
    this.blackHoles.clear()
  }

  public get size(): number {
    return this.blackHoles.size
  }
}
