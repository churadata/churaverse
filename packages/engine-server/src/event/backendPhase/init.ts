import type http from 'node:http'
import type { SceneName, Scenes } from '../../scene/types'
import { CVEvent } from '../cvEvent'

export class InitEvent extends CVEvent<Scenes> {
  public constructor(
    public readonly server: http.Server,
    public readonly sceneName: SceneName
  ) {
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
