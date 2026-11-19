import type { GameIds } from '../interface/gameIds'
import { GamePluginError } from './gamePluginError'

export class GameUiComponentNotFoundError extends GamePluginError {
  public constructor(gameId: GameIds) {
    super(`GameId: ${gameId} に対応するUIコンポーネントが見つかりません`)
  }
}
