import { CVEvent, type IMainScene } from 'churaverse-engine-client'

/**
 * プレイヤーがベットした際のレスポンスイベント
 * @param playerId ベットしたプレイヤーID
 * @param betCoins ベットしたコイン数
 * @param currentCoins 現在の所持コイン数
 */
export class SendBetCoinResponseEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly playerId: string,
    public readonly betCoins: number,
    public readonly currentCoins: number
  ) {
    super('sendBetCoinResponse', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    sendBetCoinResponse: SendBetCoinResponseEvent
  }
}
