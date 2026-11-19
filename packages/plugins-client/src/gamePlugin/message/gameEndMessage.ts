import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'
import type { GameIds } from '../interface/gameIds'

export interface GameEndData extends SendableObject {
  gameId: GameIds
}

/**
 * サーバーからクライアントへのゲーム終了リクエストメッセージ
 */
export class RequestGameEndMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: GameEndData) {
    super('requestGameEnd', data)
  }
}

/**
 * クライアントからサーバーへのゲーム終了レスポンスメッセージ
 */
export class ResponseGameEndMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: GameEndData) {
    super('responseGameEnd', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    requestGameEnd: RequestGameEndMessage
    responseGameEnd: ResponseGameEndMessage
  }
}
