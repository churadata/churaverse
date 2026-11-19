import type { Item } from '@churaverse/churaren-item-plugin-server'
import { MAX_ITEMS } from '../churarenPlayerPlugin'
import type { IPlayerMaterialItemRepository } from '../interface/IPlayerMaterialItemRepository'

export class PlayerMaterialItemRepository implements IPlayerMaterialItemRepository {
  private readonly materialItemBoxes = new Map<string, Item[]>()
  public set(playerId: string, item: Item): void {
    if (this.materialItemBoxes.has(playerId)) {
      const items = this.materialItemBoxes.get(playerId)
      if (items != null && items.length < MAX_ITEMS && !items.includes(item)) {
        items.push(item)
      }
    } else {
      this.materialItemBoxes.set(playerId, [item])
    }
  }

  public delete(playerId: string, itemId: string): void {
    const items = this.materialItemBoxes.get(playerId)
    if (items != null) {
      // itemId に一致するアイテムを探して削除
      this.materialItemBoxes.set(
        playerId,
        items.filter((item) => item.itemId !== itemId)
      )
    }
  }

  public getAllItem(playerId: string): Item[] {
    return this.materialItemBoxes.get(playerId) ?? []
  }

  public clear(playerId: string): void {
    this.materialItemBoxes.delete(playerId)
  }

  public clearAll(): void {
    this.materialItemBoxes.clear()
  }
}
