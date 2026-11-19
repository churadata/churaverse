import { CVEvent, type IMainScene } from 'churaverse-engine-client'

/**
 * 現在のマップ変更が完了した際にpostされるイベント
 */
export class DidChangeMapEvent extends CVEvent<IMainScene> {
  public constructor(public readonly mapId: string) {
    super('didChangeMap', false)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    didChangeMap: DidChangeMapEvent
  }
}
