import type { IGameUiComponent } from '@churaverse/game-plugin-client'
import type { ResultScreenType } from '../type/resultScreenType'

export interface ISynchroBreakResultScreen extends IGameUiComponent {
  createResultRanking: (type: ResultScreenType) => void
  close: () => void
}
