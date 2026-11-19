import { CVEvent, type IMainScene } from 'churaverse-engine-client'

export class OpenKeyBindWindowEvent extends CVEvent<IMainScene> {
  public constructor() {
    super('openKeyBindWindow', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    openKeyBindWindow: OpenKeyBindWindowEvent
  }
}
