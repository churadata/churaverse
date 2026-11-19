import { CVEvent, type IMainScene } from 'churaverse-engine-client'

/**
 * 全プレイヤーの所持コイン数を更新するイベント
 * @param playersCoin プレイヤーのidと所持コイン数のリスト
 */
export class UpdatePlayersCoinEvent extends CVEvent<IMainScene> {
  public constructor(public readonly playersCoin: Array<{ playerId: string; coins: number }>) {
    super('updatePlayersCoin', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    updatePlayersCoin: UpdatePlayersCoinEvent
  }
}
