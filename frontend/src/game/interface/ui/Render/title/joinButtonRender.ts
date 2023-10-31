import { GameObjects, Scene } from 'phaser'
import { TitleInteractor } from '../../../../interactor/titleInteractor'
import { createUIContainer } from '../../util/container'
import { IJoinButtonRender } from '../../../../domain/IRender/IJoinButtonRender'
import { PlayerRoleName } from '../../../../domain/model/types'

const BUTTON_COLOR = {
  /* eslint-disable */
  DEFAULT_COLOR: '#1292e2',
  MOUSEOVER_BUTTON_COLOR: '#64bbf2',
  /* eslint-enable */
}

const ADMIN_BUTTON_COLOR = {
  /* eslint-disable */
  DEFAULT_COLOR: '#e62ea2',
  MOUSEOVER_BUTTON_COLOR: '#ff66c7',
  /* eslint-enable */
}

/**
 * MainSceneに遷移するためのボタン. Titleで表示される
 */
export class JoinButtonRender implements IJoinButtonRender {
  private readonly joinButton: GameObjects.Text
  private readonly container: GameObjects.Container
  private interactor?: TitleInteractor
  private joinButtonColor = BUTTON_COLOR

  private constructor(scene: Scene, playerRole: PlayerRoleName) {
    const buttonWidth = 40
    const buttonHeight = 20

    this.joinButton = scene.add
      .text(0, 0, 'Join')
      .setOrigin(0.5)
      .setPadding(buttonWidth, buttonHeight)
      .setStyle({ backgroundColor: this.joinButtonColor.DEFAULT_COLOR, align: 'center' })
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

    this.container = createUIContainer(scene, 0.5, 0.62)
    this.container.add(this.joinButton)
    this.changeButtonColor(playerRole)
  }

  // 書き方統一のためbuild実装
  public static async build(scene: Scene, playerRole: PlayerRoleName): Promise<JoinButtonRender> {
    return await new Promise<JoinButtonRender>((resolve) => {
      resolve(new JoinButtonRender(scene, playerRole))
    })
  }

  public setInteractor(interactor: TitleInteractor): void {
    this.interactor = interactor
  }

  // 管理者のときと一般ユーザのときでjoinボタンの色を変更する
  public changeButtonColor(role: PlayerRoleName): void {
    if (role === 'admin') {
      this.joinButtonColor = ADMIN_BUTTON_COLOR
      this.joinButton.setStyle({ backgroundColor: ADMIN_BUTTON_COLOR.DEFAULT_COLOR, align: 'center' })
    } else {
      this.joinButtonColor = BUTTON_COLOR
      this.joinButton.setStyle({ backgroundColor: BUTTON_COLOR.DEFAULT_COLOR, align: 'center' })
    }
  }

  /** マウスオーバーした時の動作 */
  private onMouseover(): void {
    // ボタンの色を明るくする
    this.joinButton.setStyle({ backgroundColor: this.joinButtonColor.MOUSEOVER_BUTTON_COLOR })
  }

  /** マウスアウトした時の動作 */
  private onMouseout(): void {
    // ボタンの色を元に戻す
    this.joinButton.setStyle({ backgroundColor: this.joinButtonColor.DEFAULT_COLOR })
  }

  /** buttonが押されたときの動作 */
  private onClick(): void {
    const validateResult = this.interactor?.titleNamaFieldRender.validate() ?? false

    if (validateResult) {
      // 処理が重複しないように処理中はボタンを押せないようにロック
      this.joinButton.disableInteractive()

      // MainSceneに遷移
      this.interactor?.transitionToMain()
    } else {
      alert('空文字列、空白文字列のみの名前は利用できません')
    }
  }
}
