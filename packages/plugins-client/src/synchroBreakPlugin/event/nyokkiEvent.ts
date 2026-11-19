import { CVEvent, type IMainScene } from 'churaverse-engine-client'

/**
 * プレイヤーがニョッキアクションを実行した際のイベント
 * @param playerId ニョッキアクションを実行したプレイヤーのid
 */
export class NyokkiEvent extends CVEvent<IMainScene> {
  public constructor(public readonly playerId: string) {
    super('nyokki', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    nyokki: NyokkiEvent
  }
}
