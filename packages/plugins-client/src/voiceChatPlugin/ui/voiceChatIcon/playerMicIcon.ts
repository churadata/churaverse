import type { IPlayerRenderer } from '@churaverse/player-plugin-client'
import type { Scene } from 'phaser'
import { MIC_ACTIVE_ICON_PATH, MIC_INACTIVE_ICON_PATH } from './micIcon'

const PLAYER_MIC_TEXTURE_NAME = 'player_mic_icon'
const PLAYER_MIC_INACTIVE_TEXTURE_NAME = 'player_mic_inactive_icon'

export class PlayerMicIcon {
  private readonly micIconActive: Phaser.GameObjects.Image
  private readonly micIconInactive: Phaser.GameObjects.Image
  public constructor(scene: Scene, playerRenderer: IPlayerRenderer) {
    this.micIconActive = scene.add.image(-30, -20, PLAYER_MIC_TEXTURE_NAME).setDisplaySize(25, 25).setAlpha(0)
    this.micIconInactive = scene.add
      .image(-30, -20, PLAYER_MIC_INACTIVE_TEXTURE_NAME)
      .setDisplaySize(25, 25)
      .setAlpha(1)

    playerRenderer.addToPlayerFrontContainer(this.micIconActive)
    playerRenderer.addToPlayerFrontContainer(this.micIconInactive)
  }

  public static loadAssets(scene: Scene): void {
    scene.load.image(PLAYER_MIC_TEXTURE_NAME, MIC_ACTIVE_ICON_PATH)
    scene.load.image(PLAYER_MIC_INACTIVE_TEXTURE_NAME, MIC_INACTIVE_ICON_PATH)
  }

  public setAlphaToMicIcon(alpha: integer): void {
    this.micIconActive.setAlpha(alpha)
  }

  public handleMicIcons(active: boolean): void {
    if (active) {
      this.micIconInactive.setAlpha(0)
    } else {
      this.micIconInactive.setAlpha(1)
      this.micIconActive.setAlpha(0)
    }
  }
}
