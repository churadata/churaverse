import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'
import type { GameIds } from '../interface/gameIds'

export interface GameEndData extends SendableObject {
  gameId: GameIds
}

/**
 * クライアントからサーバーへのゲーム終了リクエストメッセージ
 */
export class RequestGameEndMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: GameEndData) {
    super('requestGameEnd', data)
  }
}

/**
 * サーバーからクライアントへのゲーム終了レスポンスメッセージ
 */
export class ResponseGameEndMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: GameEndData) {
    super('responseGameEnd', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    requestGameEnd: RequestGameEndMessage
    responseGameEnd: ResponseGameEndMessage
  }
}
