import { CVEvent, type IMainScene } from 'churaverse-engine-client'
import type { Item } from '../domain/item'

export class ChurarenItemSpawnEvent extends CVEvent<IMainScene> {
  public constructor(public readonly items: Item[]) {
    super('churarenItemSpawn', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    churarenItemSpawn: ChurarenItemSpawnEvent
  }
}
