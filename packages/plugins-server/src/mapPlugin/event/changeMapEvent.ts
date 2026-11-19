import { CVEvent, type IMainScene } from 'churaverse-engine-server'

/**
 * 現在のマップを変更するイベント. 変更完了後はdidChangeMapEventがpostされる
 */
export class ChangeMapEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly mapId: string,
    public readonly changerId: string
  ) {
    super('changeMap', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    changeMap: ChangeMapEvent
  }
}
