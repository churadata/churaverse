import { Scene } from 'phaser'
import { Interactor } from '../../../../interactor/Interactor'
import { layerSetting } from '../../util/layer'
import { WebRtcButtonContainer } from '../../Render/webRtcButtonContainer'

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
  private isActive = false
  private interactor?: Interactor

  private constructor(private readonly scene: Scene, buttonContainer: WebRtcButtonContainer) {
    // カメラbuttonの位置･見た目設定
    this.button = scene.add
      .image(-280, 70, CAMERA_INACTIVE_TEXTURE_NAME)
      .setScrollFactor(0)
      .setAlpha(0.5)
      .setDisplaySize(40, 40)
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.onClick()
      })

    layerSetting(this.button, 'WebRtcUI')

    buttonContainer.addButton(this.button)
  }

  public static async build(scene: Scene, buttonContainer: WebRtcButtonContainer): Promise<CameraButton> {
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
      return new CameraButton(scene, buttonContainer)
    })
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }

  /** buttonが押されたときの動作 */
  private onClick(): void {
    if (this.isActive) {
      void this.tryStopCameraVideo()
    } else {
      void this.tryStartCameraVideo()
    }
  }

  /**
   * Webカメラを開始する
   * 開始できなかった場合はbuttonを非有効化
   */
  private async tryStartCameraVideo(): Promise<void> {
    const isStartSuccessful = await this.interactor?.startCameraVideo()
    if (isStartSuccessful ?? false) {
      this.activateButton()
    } else {
      this.deactivateButton()
    }
  }

  /**
   * Webカメラを停止する
   * 停止できなかった場合はbuttonを有効化
   */
  private async tryStopCameraVideo(): Promise<void> {
    const isStopSuccessful = await this.interactor?.stopCameraVideo()
    if (isStopSuccessful ?? false) {
      this.deactivateButton()
    } else {
      this.activateButton()
    }
  }

  /** buttonが有効になったときの見た目の変化 */
  private activateButton(): void {
    this.isActive = true
    this.button.setTexture(CAMERA_ACTIVE_TEXTURE_NAME)
    this.button.setAlpha(1)
  }

  /** buttonが無効になったときの見た目の変化 */
  private deactivateButton(): void {
    this.isActive = false
    this.button.setTexture(CAMERA_INACTIVE_TEXTURE_NAME)
    this.button.setAlpha(0.5)
  }
}
