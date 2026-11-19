import type { Player } from '@churaverse/player-plugin-client'
import { CVEvent, type IMainScene } from 'churaverse-engine-client'
import type { AlchemyItem } from '../domain/alchemyItem'

/**
 * 錬金アイテムを使うイベント
 */
export class UseAlchemyItemEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly ownPlayer: Player,
    public readonly alchemyItem: AlchemyItem
  ) {
    super('useAlchemyItem', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    useAlchemyItem: UseAlchemyItemEvent
  }
}
