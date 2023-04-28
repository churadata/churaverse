import { Scene } from 'phaser'
import { Interactor } from '../../interactor/Interactor'
import { layerSetting } from '../../layer'

/** カメラアクティブ時のアイコンのテクスチャ名 */
const CAMERA_ACTIVE_TEXTURE_NAME = 'video_active'

/** カメラアクティブ時のアイコンのパス */
const CAMERA_ACTIVE_IMAGE_PATH = 'assets/video.png'

/** カメラ非アクティブ時のアイコンのテクスチャ名 */
const CAMERA_INACTIVE_TEXTURE_NAME = 'video_inactive'

/** カメラ非アクティブ時のアイコンのパス */
const CAMERA_INACTIVE_IMAGE_PATH = 'assets/video_off.png'

export class CameraButton {
  public button: Phaser.GameObjects.Image

  private constructor(private readonly scene: Scene, private readonly interactor: Interactor) {
    // カメラbuttonの位置･見た目設定
    this.button = scene.add
      .image(1150, 50, CAMERA_INACTIVE_TEXTURE_NAME)
      .setScrollFactor(0)
      .setAlpha(0.5)
      .setDisplaySize(40, 40)
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.onClick()
      })

    layerSetting(this.button, 'WebRtcUI')
  }

  public async build(scene: Scene, interactor: Interactor): Promise<CameraButton> {
    return await new Promise<void>((resolve) => {
      if (scene.textures.exists(CAMERA_ACTIVE_TEXTURE_NAME)) {
        resolve()
      }

      scene.load.image(CAMERA_ACTIVE_TEXTURE_NAME, CAMERA_ACTIVE_IMAGE_PATH)
      scene.load.image(CAMERA_INACTIVE_TEXTURE_NAME, CAMERA_INACTIVE_IMAGE_PATH)

      // textureがロードされてないときに待つ
      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.start()
    }).then(() => {
      return new CameraButton(scene, interactor)
    })
  }

  /** buttonが押されたときの動作 */
  private onClick(): void {
    // camera
  }

  /** buttonが有効になったときの見た目の変化 */
  private activateButton(): void {
    this.button.setTexture(CAMERA_ACTIVE_TEXTURE_NAME)
    this.button.setAlpha(1)
  }

  /** buttonが無効になったときの見た目の変化 */
  private deactivateButton(): void {
    this.button.setTexture(CAMERA_INACTIVE_TEXTURE_NAME)
    this.button.setAlpha(0.5)
  }
}
