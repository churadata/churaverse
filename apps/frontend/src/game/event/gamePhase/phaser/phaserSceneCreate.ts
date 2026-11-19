import { Scene } from 'phaser'
import { CVEvent } from '../../cvEvent'
import { Scenes } from '../../../scene/types'

export class PhaserSceneCreate extends CVEvent<Scenes, 'phaserSceneCreate'> {
  public constructor(public readonly scene: Scene) {
    super('phaserSceneCreate', false)
  }
}

declare module '../../events' {
  export interface CVTitleEventMap {
    phaserSceneCreate: PhaserSceneCreate
  }

  export interface CVMainEventMap {
    phaserSceneCreate: PhaserSceneCreate
  }
}
