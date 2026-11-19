import { CVEvent, type IMainScene } from 'churaverse-engine-server'

/**
 * プレイヤーがベットコインを送信した際のイベント
 * @param playerId プレイヤーid
 * @param betCoins ベットコイン数
 */
export class SendBetCoinEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly playerId: string,
    public readonly betCoins: number
  ) {
    super('sendBetCoin', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    sendBetCoin: SendBetCoinEvent
  }
}
