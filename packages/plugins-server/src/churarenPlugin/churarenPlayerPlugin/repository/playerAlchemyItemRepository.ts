import type { AlchemyItem } from '@churaverse/churaren-alchemy-base-plugin-server'
import type { IPlayerAlchemyItemRepository } from '../interface/IPlayerAlchemyItemRepository'

export class PlayerAlchemyItemRepository implements IPlayerAlchemyItemRepository {
  private readonly alchemyItemBox = new Map<string, AlchemyItem>()

  public set(playerId: string, item: AlchemyItem): void {
    this.alchemyItemBox.set(playerId, item)
  }

  public delete(playerId: string): void {
    this.alchemyItemBox.delete(playerId)
  }

  public get(playerId: string): AlchemyItem | undefined {
    return this.alchemyItemBox.get(playerId)
  }

  public clearAll(): void {
    this.alchemyItemBox.clear()
  }
}
