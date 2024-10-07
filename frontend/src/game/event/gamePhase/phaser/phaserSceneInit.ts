import { CVEvent } from '../../cvEvent'
import { Scenes } from '../../../scene/types'
import { BaseScene } from '../../../scene/IScene/baseScene'

export class PhaserSceneInit extends CVEvent<Scenes, 'phaserSceneInit'> {
  public constructor(public readonly scene: BaseScene) {
    super('phaserSceneInit', false)
  }
}

declare module '../../events' {
  export interface CVTitleEventMap {
    phaserSceneInit: PhaserSceneInit
  }

  export interface CVMainEventMap {
    phaserSceneInit: PhaserSceneInit
  }
}
