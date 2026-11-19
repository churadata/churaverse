import { CVEvent, type IMainScene } from 'churaverse-engine-server'

/**
 * ミュート状態を変更した時に発火するイベント
 */
export class ToggleMicEvent extends CVEvent<IMainScene> {
  public constructor(
    /**
     * ミュート状態を変更したプレイヤーのid
     */
    public readonly playerId: string,
    /**
     * ミュートするかアンミュートするか
     */
    public readonly isUnmute: boolean
  ) {
    super('toggleMic', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    toggleMic: ToggleMicEvent
  }
}
