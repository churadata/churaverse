import { Scene } from 'phaser'
import { Interactor } from '../../../../interactor/Interactor'
import { layerSetting } from '../../util/layer'
import { WebRtcButtonContainer } from '../../Render/webRtcButtonContainer'

/** マイクアクティブ時のアイコンのテクスチャ名 */
const MIC_ACTIVE_TEXTURE_NAME = 'microphone_active'

/** マイクアクティブ時のアイコンのパス */
const MIC_ACTIVE_IMAGE_PATH = 'assets/microphone.png'

/** マイク非アクティブ時のアイコンのテクスチャ名 */
const MIC_INACTIVE_TEXTURE_NAME = 'microphone_inactive'

/** マイク非アクティブ時のアイコンのパス */
const MIC_INACTIVE_IMAGE_PATH = 'assets/microphone_off.png'

export class MicButton {
  private readonly button: Phaser.GameObjects.Image
  private isActive = false
  private interactor?: Interactor

  private constructor(private readonly scene: Scene, buttonContainer: WebRtcButtonContainer) {
    // マイクボタンの位置･見た目設定
    this.button = scene.add
      .image(-330, 70, MIC_INACTIVE_TEXTURE_NAME)
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

  public static async build(scene: Scene, buttonContainer: WebRtcButtonContainer): Promise<MicButton> {
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
      return new MicButton(scene, buttonContainer)
    })
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }

  /** buttonが押されたときの動作 */
  private onClick(): void {
    if (this.isActive) {
      void this.tryStopVoiceStream()
    } else {
      void this.tryStartVoiceStream()
    }
  }

  /**
   * ボイスチャットを開始する
   * 開始できなかった場合はbuttonを非有効化
   */
  private async tryStartVoiceStream(): Promise<void> {
    const isStartSuccessful = await this.interactor?.startVoiceStream()
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
  private async tryStopVoiceStream(): Promise<void> {
    const isStopSuccessful = await this.interactor?.stopVoiceStream()
    if (isStopSuccessful ?? false) {
      this.deactivateButton()
    } else {
      this.activateButton()
    }
  }

  /** buttonが有効になったときの見た目の変化 */
  private activateButton(): void {
    this.isActive = true
    this.button.setTexture(MIC_ACTIVE_TEXTURE_NAME)
    this.button.setAlpha(1)
  }

  /** buttonが無効になったときの見た目の変化 */
  private deactivateButton(): void {
    this.isActive = false
    this.button.setTexture(MIC_INACTIVE_TEXTURE_NAME)
    this.button.setAlpha(0.5)
  }
}
