import type { Scenes } from '../../scene/types'
import { CVEvent } from '../cvEvent'

export class OnGameShutdownEvent extends CVEvent<Scenes> {
  public constructor() {
    super('onGameShutdown', false)
  }
}

declare module '../events' {
  export interface CVTitleEventMap {
    onGameShutdown: OnGameShutdownEvent
  }
  export interface CVMainEventMap {
    onGameShutdown: OnGameShutdownEvent
  }
}
