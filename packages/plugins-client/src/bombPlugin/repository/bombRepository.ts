import type { Bomb } from '../domain/bomb'

export class BombRepository {
  private readonly bombs = new Map<string, Bomb>()

  public set(id: string, entity: Bomb): void {
    this.bombs.set(id, entity)
  }

  public delete(id: string): void {
    this.bombs.delete(id)
  }

  public get(id: string): Bomb | undefined {
    return this.bombs.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.bombs.keys())
  }

  public get size(): number {
    return this.bombs.size
  }
}
