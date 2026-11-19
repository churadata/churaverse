import { CollidableEntityRepository } from '@churaverse/collision-detection-plugin-server'
import type { Explosion } from '../domain/explosion'
import type { IExplosionRepository } from '../domain/IExplosionRepository'

export class ExplosionRepository extends CollidableEntityRepository<Explosion> implements IExplosionRepository {
  private readonly explosions = new Map<string, Explosion>()

  public set(id: string, entity: Explosion): void {
    super.set(id, entity)
    this.explosions.set(id, entity)
  }

  public delete(id: string): void {
    super.delete(id)
    this.explosions.delete(id)
  }

  public get(id: string): Explosion | undefined {
    return this.explosions.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.explosions.keys())
  }
}
