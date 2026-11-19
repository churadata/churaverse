import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'
import type { GameIds } from '../interface/gameIds'

export interface GameAbortData extends SendableObject {
  gameId: GameIds
  playerId: string
}

/**
 * クライアントからサーバーへのゲーム中断リクエストメッセージ
 */
export class RequestGameAbortMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: GameAbortData) {
    super('requestGameAbort', data)
  }
}

/**
 * サーバーからクライアントへのゲーム中断レスポンスメッセージ
 */
export class ResponseGameAbortMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: GameAbortData) {
    super('responseGameAbort', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    requestGameAbort: RequestGameAbortMessage
    responseGameAbort: ResponseGameAbortMessage
  }
}
