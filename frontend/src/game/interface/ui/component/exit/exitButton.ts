import { Scene } from 'phaser'
import { Interactor } from '../../../../interactor/Interactor'
import { createUIContainer } from '../../util/container'

/** 退出ボタンのアイコンのテクスチャ名 */
const EXIT_ICON_TEXTURE_NAME = 'exitIcon'

/** 退出ボタンのアイコンのパス */
const EXIT_ICON_IMAGE_PATH = 'assets/exit.png'

export class ExitButton {
  private interactor?: Interactor
  public image: Phaser.GameObjects.Image
  private readonly container: Phaser.GameObjects.Container

  private constructor(scene: Scene) {
    // 退出ボタンの位置･見た目設定
    this.image = scene.add
      .image(0, 0, EXIT_ICON_TEXTURE_NAME)
      .setScrollFactor(0)
      .setAlpha(0.5)
      .setDisplaySize(40, 40)
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.onClick()
      })

    // 新しくUIContainerを作成
    const buttonContainer = scene.add.container(70, 70)
    buttonContainer.add(this.image)
    this.container = createUIContainer(scene, 0, 0)
    this.container.add(buttonContainer)
  }

  public static async build(scene: Scene): Promise<ExitButton> {
    return await new Promise<void>((resolve) => {
      if (scene.textures.exists(EXIT_ICON_TEXTURE_NAME)) {
        resolve()
      }
      scene.load.image(EXIT_ICON_TEXTURE_NAME, EXIT_ICON_IMAGE_PATH)

      // textureがロードされてないときに待つ
      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.start()
    }).then(() => {
      return new ExitButton(scene)
    })
  }

  /** buttonが押されたときの動作 */
  private onClick(): void {
    const isPlayerKicked = window.confirm('ミーティングから退出しますか？')
    if (isPlayerKicked) {
      // kickする処理を実行、interactor経由で行う
      this.interactor?.exitOwnPlayer()
    }
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }
}
