import type { IMainScene, ITitleScene, Scenes } from 'churaverse-engine-client'
import type { ITransitionManager } from '../interface/ITransitionManager'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    transitionPlugin: TransitionPluginStore<IMainScene>
  }

  export interface StoreInTitle {
    transitionPlugin: TransitionPluginStore<ITitleScene>
  }
}

export interface TransitionPluginStore<Scene extends Scenes> {
  readonly transitionManager: ITransitionManager<Scene>
}
