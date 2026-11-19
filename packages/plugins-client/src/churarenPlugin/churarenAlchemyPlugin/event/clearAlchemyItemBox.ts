import { CVEvent, type IMainScene } from 'churaverse-engine-client'

export class ClearAlchemyItemBoxEvent extends CVEvent<IMainScene> {
  public constructor(public readonly playerId: string) {
    super('clearAlchemyItemBox', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    clearAlchemyItemBox: ClearAlchemyItemBoxEvent
  }
}
