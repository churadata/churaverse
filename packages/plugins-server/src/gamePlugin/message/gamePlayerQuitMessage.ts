import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'
import type { GameIds } from '../interface/gameIds'

export interface GamePlayerQuitData extends SendableObject {
  gameId: GameIds
  playerId: string
}

/**
 * プレイヤーが参加中のゲームから離脱したことを通知するメッセージ
 */
export class GamePlayerQuitMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: GamePlayerQuitData) {
    super('gamePlayerQuit', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    gamePlayerQuit: GamePlayerQuitMessage
  }
}
