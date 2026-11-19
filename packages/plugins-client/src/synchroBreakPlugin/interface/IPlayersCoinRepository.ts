export interface IPlayersCoinRepository {
  set: (playerId: string, coins: number) => void
  get: (playerId: string) => number
  delete: (playerId: string) => void
  getPlayersSortedByCoins: () => Array<{ playerId: string; coins: number }>
}
