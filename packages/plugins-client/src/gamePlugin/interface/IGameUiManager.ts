import type { GameUiMap, GameUiName } from '../gameUiManager'
import type { GameIds } from './gameIds'

export interface IGameUiManager {
  initializeAllUis: (gameId: GameIds) => void
  getUi: <K extends GameUiName>(gameId: GameIds, uiName: K) => GameUiMap[GameIds][K] | undefined
  removeAllUis: (gameId: GameIds) => void
}
