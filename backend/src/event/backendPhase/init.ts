import http from 'http'

import { CVEvent } from '../cvEvent'
import { SceneName, Scenes } from '../../scene/types'

export class InitEvent extends CVEvent<Scenes, 'init'> {
  public constructor(public readonly server: http.Server, public readonly sceneName: SceneName) {
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
