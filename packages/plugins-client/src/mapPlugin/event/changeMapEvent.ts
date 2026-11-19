import { CVEvent, type IMainScene } from 'churaverse-engine-client'

/**
 * 現在のマップを変更するイベント. 変更完了後はdidChangeMapEventがpostされる
 */
export class ChangeMapEvent extends CVEvent<IMainScene> {
  public constructor(public readonly mapId: string) {
    super('changeMap', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    changeMap: ChangeMapEvent
  }
}
