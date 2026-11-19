import type { Scene } from 'phaser'
import type { Scenes } from '../../../scene/types'
import { CVEvent } from '../../cvEvent'

export class PhaserSceneCreate extends CVEvent<Scenes> {
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
