import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'
import type { GameIds } from '../interface/gameIds'

export interface RequestGameMidwayJoinData extends SendableObject {
  gameId: GameIds
}

/**
 * サーバーからクライアントへのゲーム途中参加リクエストメッセージ
 */
export class RequestGameMidwayJoinMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: RequestGameMidwayJoinData) {
    super('requestGameMidwayJoin', data)
  }
}

export interface ResponseGameMidwayJoinData extends SendableObject {
  gameId: GameIds
  joinPlayerId: string
  joinedPlayerIds: string[]
}

/**
 * クライアントからサーバーへのゲーム途中参加レスポンスメッセージ
 */
export class ResponseGameMidwayJoinMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ResponseGameMidwayJoinData) {
    super('responseGameMidwayJoin', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    requestGameMidwayJoin: RequestGameMidwayJoinMessage
    responseGameMidwayJoin: ResponseGameMidwayJoinMessage
  }
}
