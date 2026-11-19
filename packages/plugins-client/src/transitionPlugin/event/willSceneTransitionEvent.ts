import { CVEvent, type IMainScene, type ITitleScene, type Scenes } from 'churaverse-engine-client'
import type { ISceneTransitionDataTransporter } from '../interface/ISceneTransitionDataTransporter'

export class WillSceneTransitionEvent<CurrentScene extends Scenes, DestScene extends Scenes> extends CVEvent<Scenes> {
  public constructor(
    public readonly from: CurrentScene['sceneName'],
    public readonly to: DestScene['sceneName'],
    public readonly sceneDataTransporter: ISceneTransitionDataTransporter<CurrentScene>
  ) {
    super('willSceneTransition', false)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVTitleEventMap {
    willSceneTransition: WillSceneTransitionEvent<ITitleScene, Scenes>
  }
  export interface CVMainEventMap {
    willSceneTransition: WillSceneTransitionEvent<IMainScene, Scenes>
  }
}
