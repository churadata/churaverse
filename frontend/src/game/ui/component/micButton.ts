import { Scene } from 'phaser'
import { Interactor } from '../../interactor/Interactor'
import { layerSetting } from '../../layer'

/** マイクアクティブ時のアイコンのテクスチャ名 */
const MIC_ACTIVE_TEXTURE_NAME = 'microphone_active'

/** マイクアクティブ時のアイコンのパス */
const MIC_ACTIVE_IMAGE_PATH = 'assets/microphone.png'

/** マイク非アクティブ時のアイコンのテクスチャ名 */
const MIC_INACTIVE_TEXTURE_NAME = 'microphone_inactive'

/** マイク非アクティブ時のアイコンのパス */
const MIC_INACTIVE_IMAGE_PATH = 'assets/microphone_off.png'

export class MicButton {
  public button: Phaser.GameObjects.Image

  private constructor(private readonly scene: Scene, private readonly interactor: Interactor) {
    // マイクボタンの位置･見た目設定
    this.button = scene.add
      .image(1150, 50, MIC_INACTIVE_TEXTURE_NAME)
      .setScrollFactor(0)
      .setAlpha(0.5)
      .setDisplaySize(40, 40)
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.onClick()
      })

    layerSetting(this.button, 'WebRtcUI')
  }

  public async build(scene: Scene, interactor: Interactor): Promise<MicButton> {
    return await new Promise<void>((resolve) => {
      if (scene.textures.exists(MIC_ACTIVE_TEXTURE_NAME)) {
        resolve()
      }

      scene.load.image(MIC_ACTIVE_TEXTURE_NAME, MIC_ACTIVE_IMAGE_PATH)
      scene.load.image(MIC_INACTIVE_TEXTURE_NAME, MIC_INACTIVE_IMAGE_PATH)

      // textureがロードされてないときに待つ
      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.start()
    }).then(() => {
      return new MicButton(scene, interactor)
    })
  }

  /** buttonが押されたときの動作 */
  private onClick(): void {
    // mic
  }

  /** buttonが有効になったときの見た目の変化 */
  private activateButton(): void {
    this.button.setTexture(MIC_ACTIVE_TEXTURE_NAME)
    this.button.setAlpha(1)
  }

  /** buttonが無効になったときの見た目の変化 */
  private deactivateButton(): void {
    this.button.setTexture(MIC_INACTIVE_TEXTURE_NAME)
    this.button.setAlpha(0.5)
  }
}
