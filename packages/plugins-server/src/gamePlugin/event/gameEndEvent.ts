import { CVEvent, type IMainScene } from 'churaverse-engine-server'
import type { GameIds } from '../interface/gameIds'

/**
 * ゲーム終了時のイベント
 */
export class GameEndEvent extends CVEvent<IMainScene> {
  public constructor(public readonly gameId: GameIds) {
    super('gameEnd', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    gameEnd: GameEndEvent
  }
}
