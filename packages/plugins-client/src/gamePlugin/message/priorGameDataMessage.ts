import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'
import type { GameIds } from '../interface/gameIds'
import type { GameState } from '../type/gameState'

export interface PriorGameData extends SendableObject {
  runningGameId: GameIds
  ownerId: string
  gameState: GameState
}

/**
 * サーバーから進行中のゲームデータを受け取るメッセージ
 */
export class PriorGameDataMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: PriorGameData) {
    super('priorGameData', data)
  }
}

declare module '@churaverse/network-plugin-client' {
  export interface MainMessageMap {
    priorGameData: PriorGameDataMessage
  }
}
