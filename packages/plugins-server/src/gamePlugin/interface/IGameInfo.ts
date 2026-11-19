import type { GameState } from '../type/gameState'
import type { GameIds } from './gameIds'
import type { GamePolicy } from './gamePolicy'

/**
 * ゲームのメタ情報
 */
export interface IGameInfo {
  readonly gameId: GameIds
  readonly isActive: boolean
  readonly gameOwnerId: string | undefined
  readonly joinedPlayerIds: string[]
  readonly gameState: GameState
  readonly gamePolicy: GamePolicy
}
