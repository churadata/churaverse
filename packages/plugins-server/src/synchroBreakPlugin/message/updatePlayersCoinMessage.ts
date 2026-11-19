import { BaseMessage, type SendableObject } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'

export interface UpdatePlayersCoinData extends SendableObject {
  playersCoin: Array<{ playerId: string; coins: number }>
}

/**
 * 全プレイヤーの所持コイン数を更新するメッセージ
 */
export class UpdatePlayersCoinMessage extends BaseMessage<IMainScene> {
  public constructor(public readonly data: UpdatePlayersCoinData) {
    super('updatePlayersCoin', data)
  }
}

declare module '@churaverse/network-plugin-server' {
  export interface MainMessageMap {
    updatePlayersCoin: UpdatePlayersCoinMessage
  }
}
