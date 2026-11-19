import type { IPlayerRenderer } from '@churaverse/player-plugin-client'
import type { Scene } from 'phaser'
import { MEGAPHONE_ICON_PATH } from './megaphoneIcon'

const MEGAPHONE_ACTIVE_TEXTURE_NAME = 'player_megaphone_active'

export class PlayerMegaphoneIcon {
  private readonly megaphoneIconActive: Phaser.GameObjects.Image

  public constructor(scene: Scene, playerRenderer: IPlayerRenderer) {
    this.megaphoneIconActive = scene.add.image(0, -57, MEGAPHONE_ACTIVE_TEXTURE_NAME).setDisplaySize(20, 20).setAlpha(1)

    playerRenderer.addToPlayerFrontContainer(this.megaphoneIconActive)
  }

  public static loadAssets(scene: Scene): void {
    scene.load.image(MEGAPHONE_ACTIVE_TEXTURE_NAME, MEGAPHONE_ICON_PATH)
  }

  public handleMegaphone(active: boolean): void {
    if (active) {
      this.megaphoneIconActive.setAlpha(1)
    } else {
      this.megaphoneIconActive.setAlpha(0)
    }
  }
}
