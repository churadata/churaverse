import { CVEvent, type IMainScene } from 'churaverse-engine-client'

/**
 * 現在のマップを初期化するイベント. 初期化完了後はdidInitMapEventがpostされる
 */
export class InitMapEvent extends CVEvent<IMainScene> {
  public constructor(public readonly mapId: string) {
    super('initMap', false)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    initMap: InitMapEvent
  }
}
