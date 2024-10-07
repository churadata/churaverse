import { CVEvent } from './cvEvent'
import { SceneName, Scenes } from '../scene/types'

export class SceneTransitionEvent extends CVEvent<Scenes, 'sceneTransition'> {
  public constructor(public readonly sceneName: SceneName, public readonly playerId: string) {
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
