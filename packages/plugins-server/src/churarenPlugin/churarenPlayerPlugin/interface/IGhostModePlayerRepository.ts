import type { Player } from '@churaverse/player-plugin-server'

export interface IGhostModePlayerRepository {
  set: (playerId: string, entity: Player) => void
  has: (playerId: string) => boolean
  delete: (playerId: string) => void
  clear: () => void
  getAllId: () => string[]
  getRandomPlayerId: () => string
}
