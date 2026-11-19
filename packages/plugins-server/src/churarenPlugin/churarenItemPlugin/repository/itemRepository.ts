import { CollidableEntityRepository } from '@churaverse/collision-detection-plugin-server'
import type { IItemRepository } from '../domain/IItemRepository'
import type { Item } from '../domain/item'

export class ItemRepository extends CollidableEntityRepository<Item> implements IItemRepository {
  private readonly items = new Map<string, Item>()

  public set(id: string, entity: Item): void {
    super.set(id, entity)
    this.items.set(id, entity)
  }

  public delete(id: string): void {
    super.delete(id)
    this.items.delete(id)
  }

  public get(id: string): Item | undefined {
    return this.items.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.items.keys())
  }

  public clear(): void {
    this.getAllId().forEach((id) => {
      super.delete(id)
    })
    this.items.clear()
  }
}
