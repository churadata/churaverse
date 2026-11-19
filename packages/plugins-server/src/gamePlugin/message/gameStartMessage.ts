import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'
import type { GameIds } from '../interface/gameIds'

export interface GameStartData extends SendableObject {
  gameId: GameIds
  ownerId: string
  joinedPlayerIds: string[]
}

/**
 * サーバーからクライアントへのゲーム開始メッセージ
 */
export class GameStartMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: GameStartData) {
    super('gameStart', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    gameStart: GameStartMessage
  }
}
