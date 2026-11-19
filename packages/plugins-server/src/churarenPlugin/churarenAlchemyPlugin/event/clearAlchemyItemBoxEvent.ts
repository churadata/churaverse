import { CVEvent, type IMainScene } from 'churaverse-engine-server'

/**
 * Rendererを作って、登録するイベント
 */
export class ClearAlchemyItemBoxEvent extends CVEvent<IMainScene> {
  public constructor(public readonly playerId: string) {
    super('clearAlchemyItemBox', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    clearAlchemyItemBox: ClearAlchemyItemBoxEvent
  }
}
