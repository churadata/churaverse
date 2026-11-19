import type { Tornado } from '../domain/tornado'

export class TornadoRepository {
  private readonly tornados = new Map<string, Tornado>()

  public set(id: string, entity: Tornado): void {
    this.tornados.set(id, entity)
  }

  public delete(id: string): void {
    this.tornados.delete(id)
  }

  public get(id: string): Tornado | undefined {
    return this.tornados.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.tornados.keys())
  }

  public get size(): number {
    return this.tornados.size
  }
}
