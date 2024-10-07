import { Scene } from 'phaser'
import { CVEvent } from '../../cvEvent'
import { Scenes } from '../../../scene/types'

export class PhaserLoadAssets extends CVEvent<Scenes, 'phaserLoadAssets'> {
  public constructor(public readonly scene: Scene) {
    super('phaserLoadAssets', false)
  }
}

declare module '../../events' {
  export interface CVTitleEventMap {
    phaserLoadAssets: PhaserLoadAssets
  }

  export interface CVMainEventMap {
    phaserLoadAssets: PhaserLoadAssets
  }
}
