import type { Player } from '@churaverse/player-plugin-client'
import { CVEvent, type IMainScene } from 'churaverse-engine-client'

/**
 * プレイヤーキック時にpostされるイベント
 */
export class RequestKickPlayerEvent extends CVEvent<IMainScene> {
  public constructor(
    /**
     * キックされるプレイヤー
     */
    public readonly kicked: Player,

    /**
     * キックしたプレイヤー
     */
    public readonly kicker: Player
  ) {
    super('requestKickPlayer', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    requestKickPlayer: RequestKickPlayerEvent
  }
}
