import { CollidableEntityRepository } from '@churaverse/collision-detection-plugin-server'
import type { ITornadoRepository } from '../domain/ITornadoRepository'
import type { Tornado } from '../domain/tornado'

export class TornadoRepository extends CollidableEntityRepository<Tornado> implements ITornadoRepository {
  private readonly tornados = new Map<string, Tornado>()

  public set(id: string, entity: Tornado): void {
    super.set(id, entity)
    this.tornados.set(id, entity)
  }

  public delete(id: string): void {
    super.delete(id)
    this.tornados.delete(id)
  }

  public get(id: string): Tornado | undefined {
    return this.tornados.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.tornados.keys())
  }
}
