import { CVEvent, type IMainScene } from 'churaverse-engine-server'
import type { GameIds } from '../interface/gameIds'

/**
 * ゲーム参加可否レスポンス時のイベント
 */
export class SubmitGameJoinEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly gameId: GameIds,
    public readonly playerId: string,
    public readonly willJoin: boolean
  ) {
    super('submitGameJoin', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    submitGameJoin: SubmitGameJoinEvent
  }
}
