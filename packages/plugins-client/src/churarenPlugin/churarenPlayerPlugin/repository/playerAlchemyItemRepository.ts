import type { AlchemyItem } from '@churaverse/churaren-alchemy-base-plugin-client'
import type { IPlayerAlchemyItemRepository } from '../interface/IPlayerAlchemyItemRepository'

export class PlayerAlchemyItemRepository implements IPlayerAlchemyItemRepository {
  private readonly playerAlchemyItem = new Map<string, AlchemyItem>()

  public set(playerId: string, item: AlchemyItem): void {
    this.playerAlchemyItem.set(playerId, item)
  }

  public get(playerId: string): AlchemyItem | undefined {
    return this.playerAlchemyItem.get(playerId)
  }

  public delete(playerId: string): void {
    this.playerAlchemyItem.delete(playerId)
  }

  public clear(): void {
    this.playerAlchemyItem.clear()
  }
}
