import { CVEvent } from '../cvEvent'
import { Scenes } from '../../scene/types'

export class StartEvent extends CVEvent<Scenes, 'start'> {
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
