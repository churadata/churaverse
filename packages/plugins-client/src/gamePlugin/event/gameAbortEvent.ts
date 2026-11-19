import { CVEvent, type IMainScene } from 'churaverse-engine-client'
import type { GameIds } from '../interface/gameIds'

/**
 * ゲーム中断時のイベント
 * @param playerId ゲームを中断したプレイヤーid
 */
export class GameAbortEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly gameId: GameIds,
    public readonly playerId: string
  ) {
    super('gameAbort', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    gameAbort: GameAbortEvent
  }
}
