import { CVEvent, type IMainScene } from 'churaverse-engine-client'
import type { GameIds } from '../interface/gameIds'

export class SubmitGameJoinEvent extends CVEvent<IMainScene> {
  public constructor(
    public readonly gameId: GameIds,
    public readonly willJoin: boolean
  ) {
    super('submitGameJoin', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    submitGameJoin: SubmitGameJoinEvent
  }
}
