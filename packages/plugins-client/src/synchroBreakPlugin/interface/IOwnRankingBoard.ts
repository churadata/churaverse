import type { IGameUiComponent } from '@churaverse/game-plugin-client'
import type { NyokkiStatus } from '../type/nyokkiStatus'

export interface IOwnRankingBoard extends IGameUiComponent {
  changeNyokkiStatus: (playerId: string, status: NyokkiStatus) => void
  resetNyokkiStatus: (playerIds: string[]) => void
  updateRanking: () => void
}
