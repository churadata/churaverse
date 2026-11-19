import { CVEvent, type IMainScene } from 'churaverse-engine-server'
import type { Item } from '../domain/item'

/**
 * アイテムを入手したら発火するイベント
 */
export class GetChurarenItemEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly playerId: string,
    public readonly item: Item
  ) {
    super('getChurarenItem', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    getChurarenItem: GetChurarenItemEvent
  }
}
