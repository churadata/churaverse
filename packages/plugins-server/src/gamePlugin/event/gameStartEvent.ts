import { CVEvent, type IMainScene } from 'churaverse-engine-server'
import type { GameIds } from '../interface/gameIds'

/**
 * ゲーム開始時のイベント
 * @param playerId ゲームを開始したプレイヤーid
 */
export class GameStartEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly gameId: GameIds,
    public readonly playerId: string
  ) {
    super('gameStart', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    gameStart: GameStartEvent
  }
}
