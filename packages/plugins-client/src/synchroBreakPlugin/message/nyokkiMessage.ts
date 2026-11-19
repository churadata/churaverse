import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'

export interface NyokkiData extends SendableObject {
  playerId: string
}

/**
 * ニョッキアクションを行った際に送信するメッセージ
 */
export class NyokkiMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: NyokkiData) {
    super('nyokki', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    nyokki: NyokkiMessage
  }
}
