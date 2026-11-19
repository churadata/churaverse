import { Scene } from 'phaser'
import { CVEvent } from '../../cvEvent'
import { Scenes } from '../../../scene/types'

export class PhaserScenePreload extends CVEvent<Scenes, 'phaserScenePreload'> {
  public constructor(public readonly scene: Scene) {
    super('phaserScenePreload', false)
  }
}

declare module '../../events' {
  export interface CVTitleEventMap {
    phaserScenePreload: PhaserScenePreload
  }
  export interface CVMainEventMap {
    phaserScenePreload: PhaserScenePreload
  }
}
