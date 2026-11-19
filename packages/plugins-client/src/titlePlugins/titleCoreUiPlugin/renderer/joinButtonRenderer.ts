import type { PlayerRole } from '@churaverse/shared-types-client'
import type { TransitionPluginStore } from '@churaverse/transition-plugin-client'
import { createUIContainer, DomManager, type IEventBus, type ITitleScene, type Store } from 'churaverse-engine-client'
import type { GameObjects, Scene } from 'phaser'
import type { TitlePlayerPluginStore } from '../../titlePlayerPlugin/store/defTitlePlayerPlugin'
import type { IJoinButtonRenderer } from '../domain/IJoinButtonRenderer'

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
export class JoinButtonRenderer implements IJoinButtonRenderer {
  private readonly joinButton: GameObjects.Text
  private readonly container: GameObjects.Container
  private joinButtonColor = BUTTON_COLOR
  private readonly titlePlayerPluginStore: TitlePlayerPluginStore
  private readonly transitionPluginStore: TransitionPluginStore<ITitleScene>

  public constructor(
    scene: Scene,
    store: Store<ITitleScene>,
    readonly _eventBus: IEventBus<ITitleScene>
  ) {
    this.titlePlayerPluginStore = store.of('titlePlayerPlugin')
    this.transitionPluginStore = store.of('transitionPlugin')

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
    this.changeButtonColor(this.titlePlayerPluginStore.ownPlayer.role)
  }

  // 管理者のときと一般ユーザのときでjoinボタンの色を変更する
  public changeButtonColor(role: PlayerRole): void {
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
    const errors = this.titlePlayerPluginStore.titleNameFieldRenderer.validate()

    if (errors.length > 0) {
      alert(errors.join('\n'))
      return
    } else {
      // 処理が重複しないように処理中はボタンを押せないようにロック
      this.joinButton.disableInteractive()

      // MainSceneに遷移
      DomManager.removeAll()
      this.transitionPluginStore.transitionManager.transitionTo('MainScene')
    }
  }
}
