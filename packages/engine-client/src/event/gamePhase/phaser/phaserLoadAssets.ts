import type { Scene } from 'phaser'
import type { Scenes } from '../../../scene/types'
import { CVEvent } from '../../cvEvent'

export class PhaserLoadAssets extends CVEvent<Scenes> {
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
