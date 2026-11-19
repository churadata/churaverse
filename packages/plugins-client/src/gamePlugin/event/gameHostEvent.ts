import { CVEvent, type IMainScene } from 'churaverse-engine-client'
import type { GameIds } from '../interface/gameIds'

/**
 * 参加者を募るためにゲームをホストした際に発火するイベント
 */
export class GameHostEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly gameId: GameIds,
    public readonly ownerId: string,
    public readonly timeoutSec: number
  ) {
    super('gameHost', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    gameHost: GameHostEvent
  }
}
