import { Scene } from 'phaser'
import { Interactor } from '../../../../interactor/Interactor'
import { layerSetting } from '../../util/layer'
import { WebRtcButtonContainer } from '../../Render/webRtcButtonContainer'

/** メガホンアイコンのテクスチャ名 */
const MEGAPHONE_ACTIVE_TEXTURE_NAME = 'megaphone_active'

/** メガホンアイコンのパス */
const MEGAPHONE_ACTIVE_IMAGE_PATH = 'assets/megaphone.png'

const ACTIVATE_ALPHA = 1
const DEACTIVATE_ALPHA = 0.5

export class MegaphoneButton {
  private readonly button: Phaser.GameObjects.Image
  private isActive = false
  private interactor?: Interactor

  private constructor(scene: Scene, private readonly playerId: string, buttonContainer: WebRtcButtonContainer) {
    // マイクボタンの位置･見た目設定
    this.button = scene.add
      .image(-380, 70, MEGAPHONE_ACTIVE_TEXTURE_NAME)
      .setScrollFactor(0)
      .setAlpha(DEACTIVATE_ALPHA)
      .setDisplaySize(40, 40)
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.onClick()
      })

    layerSetting(this.button, 'WebRtcUI')

    buttonContainer.addButton(this.button)
  }

  public static async build(
    scene: Scene,
    playerId: string,
    buttonContainer: WebRtcButtonContainer
  ): Promise<MegaphoneButton> {
    return await new Promise<void>((resolve) => {
      if (scene.textures.exists(MEGAPHONE_ACTIVE_TEXTURE_NAME)) {
        resolve()
      }

      scene.load.image(MEGAPHONE_ACTIVE_TEXTURE_NAME, MEGAPHONE_ACTIVE_IMAGE_PATH)

      // textureがロードされてないときに待つ
      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.start()
    }).then(() => {
      return new MegaphoneButton(scene, playerId, buttonContainer)
    })
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }

  /** buttonが押されたときの動作 */
  private onClick(): void {
    if (this.isActive) {
      this.deactivateMegaphone()
    } else {
      this.activateMegaphone()
    }
  }

  private activateMegaphone(): void {
    this.isActive = true
    this.button.setAlpha(ACTIVATE_ALPHA)
    this.interactor?.toggleMegaphone(this.playerId, true)
  }

  private deactivateMegaphone(): void {
    this.isActive = false
    this.button.setAlpha(DEACTIVATE_ALPHA)
    this.interactor?.toggleMegaphone(this.playerId, false)
  }
}
