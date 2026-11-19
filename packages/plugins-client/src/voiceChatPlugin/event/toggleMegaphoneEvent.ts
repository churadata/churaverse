import { CVEvent, type IMainScene } from 'churaverse-engine-client'

/**
 * メガホンボタンを押した時に発火するイベント
 */
export class ToggleMegaphoneEvent extends CVEvent<IMainScene> {
  public constructor(
    /**
     * メガホンボタンを押したプレイヤーのid
     */
    public readonly playerId: string,
    /**
     * メガホンを有効にするか無効にするか
     */
    public readonly active: boolean
  ) {
    super('toggleMegaphone', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    toggleMegaphone: ToggleMegaphoneEvent
  }
}
