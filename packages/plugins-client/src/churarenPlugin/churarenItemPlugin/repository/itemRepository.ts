import type { Item } from '../domain/item'

export class ItemRepository {
  private readonly items = new Map<string, Item>()

  public set(id: string, entity: Item): void {
    this.items.set(id, entity)
  }

  public delete(id: string): void {
    this.items.delete(id)
  }

  public get(id: string): Item | undefined {
    return this.items.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.items.keys())
  }

  public get size(): number {
    return this.items.size
  }

  public clear(): void {
    this.items.clear()
  }

  public has(id: string): boolean {
    return this.items.has(id)
  }
}
