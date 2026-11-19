import { CVEvent, type IMainScene } from 'churaverse-engine-server'

export class GhostModeEvent extends CVEvent<IMainScene> {
  public constructor(public readonly playerId: string) {
    super('ghostMode', true)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    ghostMode: GhostModeEvent
  }
}
