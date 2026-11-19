import { CVEvent, type IMainScene } from 'churaverse-engine-client'

/**
 * ボイスチャットをミュートした時に発火するイベント
 */
export class MuteEvent extends CVEvent<IMainScene> {
  public constructor(
    /**
     * ボイスチャットをミュートしたプレイヤーのid
     */
    public readonly playerId: string
  ) {
    super('mute', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    mute: MuteEvent
  }
}
