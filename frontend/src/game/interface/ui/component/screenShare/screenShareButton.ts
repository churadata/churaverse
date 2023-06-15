import { Scene } from 'phaser'
import { Interactor } from '../../../../interactor/Interactor'
import { layerSetting } from '../../util/layer'
import { WebRtcButtonContainer } from '../../Render/webRtcButtonContainer'
import { IScreenShareButton } from '../../../../interactor/screenShare/IScreenShareButton'

/** 画面共有アクティブ時のアイコンのテクスチャ名 */
const SCREENSHARE_ACTIVE_TEXTURE_NAME = 'screenshare_active'

/** 画面共有アクティブ時のアイコンのパス */
const SCREENSHARE_ACTIVE_IMAGE_PATH = 'assets/screenshare.png'

/** 画面共有非アクティブ時のアイコンのテクスチャ名 */
const SCREENSHARE_INACTIVE_TEXTURE_NAME = 'screenshare_inactive'

/** 画面共有非アクティブ時のアイコンのパス */
const SCREENSHARE_INACTIVE_IMAGE_PATH = 'assets/screenshare_off.png'

export class ScreenShareButton implements IScreenShareButton {
  private readonly button: Phaser.GameObjects.Image
  private isActive = false
  private interactor?: Interactor

  private constructor(private readonly scene: Scene, buttonContainer: WebRtcButtonContainer) {
    // 画面共有buttonの位置･見た目設定
    this.button = scene.add
      .image(-220, 70, SCREENSHARE_INACTIVE_TEXTURE_NAME)
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

  public static async build(scene: Scene, buttonContainer: WebRtcButtonContainer): Promise<ScreenShareButton> {
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
      return new ScreenShareButton(scene, buttonContainer)
    })
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }

  /** buttonが押されたときの動作 */
  private onClick(): void {
    if (this.isActive) {
      void this.tryStopScreenShare()
    } else {
      void this.tryStartScreenShare()
    }
  }

  /**
   * ボイスチャットを開始する
   * 開始できなかった場合はbuttonを非有効化
   */
  private async tryStartScreenShare(): Promise<void> {
    const isStartSuccessful = await this.interactor?.startScreenShare()
    if (isStartSuccessful ?? false) {
      this.activateButton()
    } else {
      this.deactivateButton()
    }
  }

  /**
   * ボイスチャットを停止する
   * 停止できなかった場合はbuttonを有効化
   */
  private async tryStopScreenShare(): Promise<void> {
    const isStopSuccessful = await this.interactor?.stopScreenShare()
    if (isStopSuccessful ?? false) {
      this.deactivateButton()
    } else {
      this.activateButton()
    }
  }

  public activateButton(): void {
    this.isActive = true
    this.button.setTexture(SCREENSHARE_ACTIVE_TEXTURE_NAME)
    this.button.setAlpha(1)
  }

  public deactivateButton(): void {
    this.isActive = false
    this.button.setTexture(SCREENSHARE_INACTIVE_TEXTURE_NAME)
    this.button.setAlpha(0.5)
  }
}
