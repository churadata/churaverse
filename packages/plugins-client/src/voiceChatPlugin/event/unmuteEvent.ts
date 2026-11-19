import { CVEvent, type IMainScene } from 'churaverse-engine-client'
/**
 * ボイスチャットをミュート解除した時に発火するイベント
 */
export class UnmuteEvent extends CVEvent<IMainScene> {
  public constructor(
    /**
     * ボイスチャットをミュート解除したプレイヤーのid
     */
    public readonly playerId: string
  ) {
    super('unmute', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    unmute: UnmuteEvent
  }
}
