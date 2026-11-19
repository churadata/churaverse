import { CollidableEntityRepository } from '@churaverse/collision-detection-plugin-server'
import type { BlackHole } from '../domain/blackHole'
import type { IBlackHoleRepository } from '../domain/IBlackHoleRepository'

export class BlackHoleRepository extends CollidableEntityRepository<BlackHole> implements IBlackHoleRepository {
  private readonly blackHoles = new Map<string, BlackHole>()

  public set(id: string, entity: BlackHole): void {
    super.set(id, entity)
    this.blackHoles.set(id, entity)
  }

  public delete(id: string): void {
    super.delete(id)
    this.blackHoles.delete(id)
  }

  public get(id: string): BlackHole | undefined {
    return this.blackHoles.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.blackHoles.keys())
  }

  public clear(): void {
    this.getAllId().forEach((id) => {
      this.delete(id)
    })
    this.blackHoles.clear()
  }
}
