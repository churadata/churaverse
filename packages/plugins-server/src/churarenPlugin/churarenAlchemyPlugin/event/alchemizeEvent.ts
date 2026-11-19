import type { Item } from '@churaverse/churaren-item-plugin-server'
import { CVEvent, type IMainScene } from 'churaverse-engine-server'

/**
 *錬金場所にきたら発火するイベント
 */
export class AlchemizeEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly playerId: string,
    public readonly item: Item
  ) {
    super('alchemize', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    alchemize: AlchemizeEvent
  }
}
