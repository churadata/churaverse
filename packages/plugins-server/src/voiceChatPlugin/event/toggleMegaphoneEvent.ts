import { CVEvent, type IMainScene } from 'churaverse-engine-server'

/**
 * メガホン状態を変更した時に発火するイベント
 */
export class ToggleMegaphoneEvent extends CVEvent<IMainScene> {
  public constructor(
    /**
     * メガホン状態を変更したプレイヤーのid
     */
    public readonly playerId: string,
    /**
     * メガホンをONにするかOFFにするか
     */
    public readonly active: boolean
  ) {
    super('toggleMegaphone', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    toggleMegaphone: ToggleMegaphoneEvent
  }
}
