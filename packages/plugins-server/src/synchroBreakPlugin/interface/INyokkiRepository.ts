import type { Nyokki } from '../model/nyokki'

export interface INyokkiRepository {
  set: (playerId: string, nyokki: Nyokki) => void
  delete: (playerId: string) => void
  get: (playerId: string) => Nyokki | undefined
  addNyokki: (playerId: string, isSuccess: boolean) => void
  clear: () => void
  getAllPlayerId: () => string[]
  playerOrders: () => string[]
  getResolvedNyokkiPlayerCount: () => number
}
