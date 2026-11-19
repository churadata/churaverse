import { CVEvent, type IMainScene } from 'churaverse-engine-server'

/**
 * 現在のマップ変更が完了した際にpostされるイベント
 */
export class DidChangeMapEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly mapId: string,
    public readonly changerId: string
  ) {
    super('didChangeMap', false)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    didChangeMap: DidChangeMapEvent
  }
}
