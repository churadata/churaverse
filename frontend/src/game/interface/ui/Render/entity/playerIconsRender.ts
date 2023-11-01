import { GameObjects, Scene } from 'phaser'
import { MIC_ACTIVE_ICON_PATH, MIC_INACTIVE_ICON_PATH } from '../../component/voiceChat/micIcon'
import { MEGAPHONE_ICON_PATH } from '../../component/voiceChat/megaphoneIcon'

const PLAYER_MIC_TEXTURE_NAME = 'player_mic_icon'

const PLAYER_MIC_INACTIVE_TEXTURE_NAME = 'player_mic_inactive_icon'

const MEGAPHONE_ACTIVE_TEXTURE_NAME = 'player_megaphone_active'

export class PlayerIconsRender {
  private readonly micIconActive: Phaser.GameObjects.Image
  private readonly micIconInactive: Phaser.GameObjects.Image
  private readonly megaphoneIconActive: Phaser.GameObjects.Image

  private constructor(scene: Scene) {
    this.micIconActive = scene.add.image(-30, -20, PLAYER_MIC_TEXTURE_NAME).setDisplaySize(25, 25).setAlpha(0)

    this.micIconInactive = scene.add
      .image(-30, -20, PLAYER_MIC_INACTIVE_TEXTURE_NAME)
      .setDisplaySize(25, 25)
      .setAlpha(0)

    this.megaphoneIconActive = scene.add.image(0, -57, MEGAPHONE_ACTIVE_TEXTURE_NAME).setDisplaySize(20, 20).setAlpha(0)
  }

  public static async build(scene: Scene): Promise<PlayerIconsRender> {
    scene.load.image(PLAYER_MIC_TEXTURE_NAME, MIC_ACTIVE_ICON_PATH)
    scene.load.image(PLAYER_MIC_INACTIVE_TEXTURE_NAME, MIC_INACTIVE_ICON_PATH)
    scene.load.image(MEGAPHONE_ACTIVE_TEXTURE_NAME, MEGAPHONE_ICON_PATH)

    return new PlayerIconsRender(scene)
  }

  public addToContainer(container: GameObjects.Container): void {
    container.add(this.micIconActive)
    container.add(this.micIconInactive)
    container.add(this.megaphoneIconActive)
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

  public handleMegaphone(active: boolean): void {
    if (active) {
      this.megaphoneIconActive.setAlpha(1)
    } else {
      this.megaphoneIconActive.setAlpha(0)
    }
  }
}
