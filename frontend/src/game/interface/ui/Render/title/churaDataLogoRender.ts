import { GameObjects, Scene } from 'phaser'
import { createUIContainer } from '../../util/container'
import { KeyDetector } from '../../../keyboard/keyDetector'
import { TitleInteractor } from '../../../../interactor/titleInteractor'

const CHURADATA_LOGO_IMAGE_PATH = 'assets/churaDataLogo.png'

const CHURADATA_LOGO_IMAGE_KEY = 'churaData-logo-image'

/**
 * ちゅらデータのロゴを表示する
 */
export class ChuraDataLogoRender {
  private readonly container: GameObjects.Container
  private readonly image: Phaser.GameObjects.Image
  private interactor?: TitleInteractor
  public constructor(scene: Scene, private readonly keyDetector: KeyDetector) {
    this.image = scene.add
      .image(-45, -35, CHURADATA_LOGO_IMAGE_KEY)
      .setDisplaySize(70, 70)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.onClick()
      })
    this.container = createUIContainer(scene, 1, 1)
    this.container.add(this.image)
  }

  public static async build(scene: Scene, keyDetector: KeyDetector): Promise<ChuraDataLogoRender> {
    return await new Promise<void>((resolve) => {
      if (scene.textures.exists(CHURADATA_LOGO_IMAGE_KEY)) {
        resolve()
      }
      scene.load.image(CHURADATA_LOGO_IMAGE_KEY, CHURADATA_LOGO_IMAGE_PATH)

      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.start()
    }).then(() => {
      return new ChuraDataLogoRender(scene, keyDetector)
    })
  }

  public setInteractor(interactor: TitleInteractor): void {
    this.interactor = interactor
  }

  /** クリックした時の動作 */
  private onClick(): void {
    // spaceKeyが押されているか判定
    const isSpaceKeyDown = this.keyDetector.isPressed('SPACE')
    // shiftKeyが押されているか判定
    const isShiftKeyDown = this.keyDetector.isPressed('SHIFT')
    if (isSpaceKeyDown && isShiftKeyDown) {
      this.interactor?.toggleRole()
    }
  }
}
