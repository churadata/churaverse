import type { Explosion } from '../domain/explosion'

export class ExplosionRepository {
  private readonly explosions = new Map<string, Explosion>()

  public set(id: string, entity: Explosion): void {
    this.explosions.set(id, entity)
  }

  public delete(id: string): void {
    this.explosions.delete(id)
  }

  public get(id: string): Explosion | undefined {
    return this.explosions.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.explosions.keys())
  }

  public get size(): number {
    return this.explosions.size
  }
}
