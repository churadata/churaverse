import { CVEvent, type IMainScene } from 'churaverse-engine-client'
import type { GameIds } from '../interface/gameIds'

/**
 * ゲーム開始時のイベント
 * @param playerId ゲームを開始したプレイヤーid
 * @param joinedPlayerIds ゲーム参加者のプレイヤーid
 *
 */
export class GameStartEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly gameId: GameIds,
    public readonly playerId: string,
    public readonly joinedPlayerIds: string[]
  ) {
    super('gameStart', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    gameStart: GameStartEvent
  }
}
