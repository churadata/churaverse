import { CVEvent, type IMainScene } from 'churaverse-engine-server'
import type { GameIds } from '../interface/gameIds'

/**
 * 参加者を募るためにゲームをホストした際に発火するイベント
 */
export class GameHostEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly gameId: GameIds,
    public readonly ownerId: string
  ) {
    super('gameHost', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    gameHost: GameHostEvent
  }
}
