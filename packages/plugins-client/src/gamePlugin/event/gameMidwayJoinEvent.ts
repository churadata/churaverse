import { CVEvent, type IMainScene } from 'churaverse-engine-client'
import type { GameIds } from '../interface/gameIds'

/**
 * ゲーム途中参加イベント
 */
export class GameMidwayJoinEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly gameId: GameIds,
    public readonly joinPlayerId: string,
    public readonly joinedPlayerIds: string[]
  ) {
    super('gameMidwayJoin', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    gameMidwayJoin: GameMidwayJoinEvent
  }
}
