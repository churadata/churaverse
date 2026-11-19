import type { RevivalItem } from '../domain/revivalItem'

export class RevivalItemRepository {
  private readonly revivalItems = new Map<string, RevivalItem>()

  public set(id: string, entity: RevivalItem): void {
    this.revivalItems.set(id, entity)
  }

  public delete(id: string): void {
    this.revivalItems.delete(id)
  }

  public get(id: string): RevivalItem | undefined {
    return this.revivalItems.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.revivalItems.keys())
  }

  public get size(): number {
    return this.revivalItems.size
  }
}
