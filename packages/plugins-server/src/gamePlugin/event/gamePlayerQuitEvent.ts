import { CVEvent, type IMainScene } from 'churaverse-engine-server'
import type { GameIds } from '../interface/gameIds'

/**
 * プレイヤーが参加中のゲームから離脱したことを通知するイベント
 */
export class GamePlayerQuitEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly gameId: GameIds,
    public readonly playerId: string
  ) {
    super('gamePlayerQuit', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    gamePlayerQuit: GamePlayerQuitEvent
  }
}
