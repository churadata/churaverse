import type { SceneName, Scenes } from '../scene/types'
import { CVEvent } from './cvEvent'

export class SceneTransitionEvent extends CVEvent<Scenes> {
  public constructor(
    public readonly sceneName: SceneName,
    public readonly playerId: string
  ) {
    super('sceneTransition', false)
  }
}

declare module './events' {
  export interface CVTitleEventMap {
    sceneTransition: SceneTransitionEvent
  }
  export interface CVMainEventMap {
    sceneTransition: SceneTransitionEvent
  }
}
