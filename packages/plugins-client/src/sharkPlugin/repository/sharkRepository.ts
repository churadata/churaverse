import type { Shark } from '../domain/shark'

/**
 * Sharkのインスタンスを格納する場所
 */
export class SharkRepository {
  private readonly sharks = new Map<string, Shark>()

  public set(id: string, shark: Shark): void {
    this.sharks.set(id, shark)
  }

  public delete(id: string): void {
    this.sharks.delete(id)
  }

  public get(id: string): Shark | undefined {
    return this.sharks.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.sharks.keys())
  }

  get size(): number {
    return this.sharks.size
  }
}
