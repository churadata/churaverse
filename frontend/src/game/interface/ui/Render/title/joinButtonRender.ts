import { GameObjects, Scene } from 'phaser'
import { TitleInteractor } from '../../../../interactor/titleInteractor'
import { createUIContainer } from '../../util/container'
const BUTTON_COLOR = '#1292e2'
const MOUSEOVER_BUTTON_COLOR = '#64bbf2'

/**
 * MainSceneに遷移するためのボタン. Titleで表示される
 */
export class JoinButtonRender {
  private readonly joinButton: GameObjects.Text
  private readonly container: GameObjects.Container
  private interactor?: TitleInteractor

  private constructor(scene: Scene) {
    const buttonWidth = 40
    const buttonHeight = 20

    this.joinButton = scene.add
      .text(0, 0, 'Join')
      .setOrigin(0.5)
      .setPadding(buttonWidth, buttonHeight)
      .setStyle({ backgroundColor: BUTTON_COLOR, align: 'center' })
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => {
        this.onMouseover()
      })
      .on('pointerout', () => {
        this.onMouseout()
      })
      .on('pointerdown', () => {
        this.onClick()
      })

    this.container = createUIContainer(scene, 0.5, 0.65)
    this.container.add(this.joinButton)
  }

  // 書き方統一のためbuild実装
  public static async build(scene: Scene): Promise<JoinButtonRender> {
    return await new Promise<JoinButtonRender>((resolve) => {
      resolve(new JoinButtonRender(scene))
    })
  }

  public setInteractor(interactor: TitleInteractor): void {
    this.interactor = interactor
  }

  /** マウスオーバーした時の動作 */
  private onMouseover(): void {
    // ボタンの色を明るくする
    this.joinButton.setStyle({ backgroundColor: MOUSEOVER_BUTTON_COLOR })
  }

  /** マウスアウトした時の動作 */
  private onMouseout(): void {
    // ボタンの色を元に戻す
    this.joinButton.setStyle({ backgroundColor: BUTTON_COLOR })
  }

  /** buttonが押されたときの動作 */
  private onClick(): void {
    // 処理が重複しないように処理中はボタンを押せないようにロック
    this.joinButton.disableInteractive()

    // MainSceneに遷移
    this.interactor?.transitionToMain()
  }
}
