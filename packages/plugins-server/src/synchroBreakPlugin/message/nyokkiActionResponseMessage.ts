import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface NyokkiActionResponseData extends SendableObject {
  sameTimePlayersId: string[]
  isSuccess: boolean
  nyokkiTime: number
  order: number
}

/**
 * ニョッキアクションのレスポンスを返すメッセージ
 */
export class NyokkiActionResponseMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: NyokkiActionResponseData) {
    super('nyokkiActionResponse', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    nyokkiActionResponse: NyokkiActionResponseMessage
  }
}
