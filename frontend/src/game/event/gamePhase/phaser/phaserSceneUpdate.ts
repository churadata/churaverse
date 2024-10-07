import { Scene } from 'phaser'
import { CVEvent } from '../../cvEvent'
import { Scenes } from '../../../scene/types'

export class PhaserSceneUpdate extends CVEvent<Scenes, 'phaserSceneUpdate'> {
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
