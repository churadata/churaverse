import type { Scenes } from '../../scene/types'
import { CVEvent } from '../cvEvent'

export class StartEvent extends CVEvent<Scenes> {
  public constructor() {
    super('start', false)
  }
}

declare module '../events' {
  export interface CVTitleEventMap {
    start: StartEvent
  }
  export interface CVMainEventMap {
    start: StartEvent
  }
}
