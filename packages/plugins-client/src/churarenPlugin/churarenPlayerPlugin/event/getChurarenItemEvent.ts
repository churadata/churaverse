import { CVEvent, type IMainScene } from 'churaverse-engine-client'

/**
 * アイテムを入手したら発火するイベント
 */
export class GetChurarenItemEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly playerId: string,
    public readonly itemId: string
  ) {
    super('getChurarenItem', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    getChurarenItem: GetChurarenItemEvent
  }
}
