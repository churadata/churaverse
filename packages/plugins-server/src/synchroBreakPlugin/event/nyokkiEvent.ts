import { CVEvent, type IMainScene } from 'churaverse-engine-server'

/**
 * プレイヤーがニョッキアクションを実行した際のイベント
 * @param playerId ニョッキアクションを実行したプレイヤーのid
 */
export class NyokkiEvent extends CVEvent<IMainScene> {
  public constructor(public readonly playerId: string) {
    super('nyokki', false)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    nyokki: NyokkiEvent
  }
}
