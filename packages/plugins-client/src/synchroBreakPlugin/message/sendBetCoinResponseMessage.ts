import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface SendBetCoinResponseData extends SendableObject {
  playerId: string
  betCoins: number
  currentCoins: number
}

/**
 * プレイヤーが賭けたコイン数と現在の所持コイン数を送信するメッセージ
 */
export class SendBetCoinResponseMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: SendBetCoinResponseData) {
    super('sendBetCoinResponse', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    sendBetCoinResponse: SendBetCoinResponseMessage
  }
}
