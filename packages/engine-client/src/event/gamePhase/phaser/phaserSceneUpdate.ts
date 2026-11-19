import type { Scene } from 'phaser'
import type { Scenes } from '../../../scene/types'
import { CVEvent } from '../../cvEvent'

export class PhaserSceneUpdate extends CVEvent<Scenes> {
  public constructor(public readonly scene: Scene) {
    super('phaserSceneUpdate', false)
  }
}

declare module '../../events' {
  export interface CVTitleEventMap {
    phaserSceneUpdate: PhaserSceneUpdate
  }
  export interface CVMainEventMap {
    phaserSceneUpdate: PhaserSceneUpdate
  }
}
