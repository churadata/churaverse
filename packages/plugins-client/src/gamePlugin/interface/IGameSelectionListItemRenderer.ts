import type { GameState } from '../type/gameState'
import type { GameIds } from './gameIds'

export interface IGameSelectionListItemRenderer {
  onPriorGameData: (gameId: GameIds, gameState: GameState) => void
  onGameHost: (gameId: GameIds) => void
  onGameStart: (gameId: GameIds, isJoined: boolean) => void
  resetStartButton: () => void
}

export type StartButtonState = GameState | 'midwayJoin'
