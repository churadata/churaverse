import { CVEvent, type IMainScene } from 'churaverse-engine-client'

export class GhostModeEvent extends CVEvent<IMainScene> {
  public constructor(public readonly id: string) {
    super('ghostMode', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    ghostMode: GhostModeEvent
  }
}
