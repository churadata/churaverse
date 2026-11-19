import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'
import type { GameIds } from '../interface/gameIds'

export interface RequestGameHostData extends SendableObject {
  gameId: GameIds
  ownerId: string
}

/**
 * クライアントからサーバーへのゲーム開催メッセージ
 */
export class RequestGameHostMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: RequestGameHostData) {
    super('requestGameHost', data)
  }
}

export interface ResponseGameHostData extends SendableObject {
  gameId: GameIds
  ownerId: string
  timeoutSec: number
}

export class ResponseGameHostMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: ResponseGameHostData) {
    super('responseGameHost', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    requestGameHost: RequestGameHostMessage
    responseGameHost: ResponseGameHostMessage
  }
}
