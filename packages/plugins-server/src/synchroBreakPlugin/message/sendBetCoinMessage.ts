import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface SendBetCoinData extends SendableObject {
  playerId: string
  betCoins: number
}

/**
 * プレイヤーが賭けたコイン数を送信するメッセージ
 */
export class SendBetCoinMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SendBetCoinData) {
    super('sendBetCoin', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    sendBetCoin: SendBetCoinMessage
  }
}
