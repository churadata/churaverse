import { CVEvent, type IMainScene } from 'churaverse-engine-server'
import type { GameIds } from '../interface/gameIds'

/**
 * プレイヤーが参加中のゲームに途中参加したことを通知するイベント
 */
export class GameMidwayJoinEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly gameId: GameIds,
    public readonly playerId: string
  ) {
    super('gameMidwayJoin', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    gameMidwayJoin: GameMidwayJoinEvent
  }
}
