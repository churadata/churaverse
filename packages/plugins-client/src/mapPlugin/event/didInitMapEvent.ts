import { CVEvent, type IMainScene } from 'churaverse-engine-client'

/**
 * マップの初期化が完了した際にpostされるイベント
 */
export class DidInitMapEvent extends CVEvent<IMainScene> {
  public constructor(public readonly mapId: string) {
    super('didInitMap', false)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    didInitMap: DidInitMapEvent
  }
}
