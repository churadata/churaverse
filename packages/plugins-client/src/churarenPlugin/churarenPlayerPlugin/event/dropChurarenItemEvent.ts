import { CVEvent, type IMainScene } from 'churaverse-engine-client'

/**
 * アイテムを捨てる時に発火するイベント
 */
export class DropChurarenItemEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly playerId: string,
    public readonly itemId: string
  ) {
    super('dropChurarenItem', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    dropChurarenItem: DropChurarenItemEvent
  }
}
