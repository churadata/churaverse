import { CVEvent, type IMainScene } from 'churaverse-engine-client'

export class ChurarenItemDespawnEvent extends CVEvent<IMainScene> {
  public constructor(public readonly itemIds: string[]) {
    super('churarenItemDespawn', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    churarenItemDespawn: ChurarenItemDespawnEvent
  }
}
