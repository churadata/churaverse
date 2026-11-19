import type { Scene } from 'phaser'
import type { Scenes } from '../../../scene/types'
import { CVEvent } from '../../cvEvent'

export class PhaserScenePreload extends CVEvent<Scenes> {
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
