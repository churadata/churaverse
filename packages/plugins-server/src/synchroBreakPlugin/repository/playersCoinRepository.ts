import { SynchroBreakPlayerCoinsNotFoundError } from '../errors/synchroBreakPlayerCoinsNotFoundError'
import type { IPlayersCoinRepository } from '../interface/IPlayersCoinRepository'

/**
 * playerIdとプレイヤーの所持コイン枚数を保存する
 */
export class PlayersCoinRepository implements IPlayersCoinRepository {
  private readonly playerCoins = new Map<string, number>()

  public set(playerId: string, coinNumber: number): void {
    this.playerCoins.set(playerId, coinNumber)
  }

  public get(playerId: string): number {
    const coins = this.playerCoins.get(playerId)
    if (coins === undefined) {
      throw new SynchroBreakPlayerCoinsNotFoundError(playerId)
    }
    return coins
  }

  public delete(playerId: string): void {
    this.playerCoins.delete(playerId)
  }

  /**
   * @returns プレイヤーのコイン枚数を降順にソートした配列
   */
  public sortedPlayerCoins(): Array<{ playerId: string; coins: number }> {
    return Array.from(this.playerCoins.entries())
      .map(([playerId, coins]) => ({ playerId, coins }))
      .sort((a, b) => b.coins - a.coins)
  }
}
