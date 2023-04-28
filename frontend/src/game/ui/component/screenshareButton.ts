import { Scene } from 'phaser'
import { Interactor } from '../../interactor/Interactor'
import { layerSetting } from '../../layer'

/** 画面共有アクティブ時のアイコンのテクスチャ名 */
const SCREENSHARE_ACTIVE_TEXTURE_NAME = 'screenshare_active'

/** 画面共有アクティブ時のアイコンのパス */
const SCREENSHARE_ACTIVE_IMAGE_PATH = 'assets/screenshare.png'

/** 画面共有非アクティブ時のアイコンのテクスチャ名 */
const SCREENSHARE_INACTIVE_TEXTURE_NAME = 'screenshare_inactive'

/** 画面共有非アクティブ時のアイコンのパス */
const SCREENSHARE_INACTIVE_IMAGE_PATH = 'assets/screenshare_off.png'

export class ScreenshareButton {
  public button: Phaser.GameObjects.Image

  private constructor(private readonly scene: Scene, private readonly interactor: Interactor) {
    // 画面共有buttonの位置･見た目設定
    this.button = scene.add
      .image(1150, 50, SCREENSHARE_INACTIVE_TEXTURE_NAME)
      .setScrollFactor(0)
      .setAlpha(0.5)
      .setDisplaySize(40, 40)
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.onClick()
      })

    layerSetting(this.button, 'WebRtcUI')
  }

  public async build(scene: Scene, interactor: Interactor): Promise<ScreenshareButton> {
    return await new Promise<void>((resolve) => {
      if (scene.textures.exists(SCREENSHARE_ACTIVE_TEXTURE_NAME)) {
        resolve()
      }

      scene.load.image(SCREENSHARE_ACTIVE_TEXTURE_NAME, SCREENSHARE_ACTIVE_IMAGE_PATH)
      scene.load.image(SCREENSHARE_INACTIVE_TEXTURE_NAME, SCREENSHARE_INACTIVE_IMAGE_PATH)

      // textureがロードされてないときに待つ
      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.start()
    }).then(() => {
      return new ScreenshareButton(scene, interactor)
    })
  }

  /** buttonが押されたときの動作 */
  private onClick(): void {
    // screenshare
  }

  /** buttonが有効になったときの見た目の変化 */
  private activateButton(): void {
    this.button.setTexture(SCREENSHARE_ACTIVE_TEXTURE_NAME)
    this.button.setAlpha(1)
  }

  /** buttonが無効になったときの見た目の変化 */
  private deactivateButton(): void {
    this.button.setTexture(SCREENSHARE_INACTIVE_TEXTURE_NAME)
    this.button.setAlpha(0.5)
  }
}
