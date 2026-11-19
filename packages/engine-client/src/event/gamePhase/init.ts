import type { Scenes } from '../../scene/types'
import { CVEvent } from '../cvEvent'

export class InitEvent extends CVEvent<Scenes> {
  public constructor() {
    super('init', false)
  }
}

declare module '../events' {
  export interface CVTitleEventMap {
    init: InitEvent
  }
  export interface CVMainEventMap {
    init: InitEvent
  }
}
