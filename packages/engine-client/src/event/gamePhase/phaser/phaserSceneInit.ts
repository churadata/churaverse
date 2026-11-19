import type { BaseScene } from '../../../scene/IScene/baseScene'
import type { Scenes } from '../../../scene/types'
import { CVEvent } from '../../cvEvent'

export class PhaserSceneInit extends CVEvent<Scenes> {
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
