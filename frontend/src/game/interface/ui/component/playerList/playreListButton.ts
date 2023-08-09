import { Scene } from 'phaser'
import { layerSetting } from '../../util/layer'
import { DialogSwitcher } from '../../Render/dialogSwitcher'
import { IDialog } from '../../../../domain/IRender/IDialog'
import { IDialogButton } from '../../../../domain/IRender/IDialogButton'
import { DialogButtonsContainer } from '../../Render/dialogButtonsContainer'

/** player一覧ボタンのアイコンのテクスチャ名 */
const PLAYER_LIST_ICON_TEXTURE_NAME = 'player-list'

/** player一覧ボタンのアイコンのパス */
const PLAYER_LIST_ICON_IMAGE_PATH = 'assets/people.png'

export class PlayerListButton implements IDialogButton {
  public image: Phaser.GameObjects.Image
  private isActivate = false

  private constructor(
    private readonly scene: Scene,
    private readonly switcher: DialogSwitcher,
    private readonly dialog: IDialog,
    private readonly container: DialogButtonsContainer
  ) {
    // player一覧の位置･見た目設定
    this.image = scene.add
      .image(0, 0, PLAYER_LIST_ICON_TEXTURE_NAME)
      .setScrollFactor(0)
      .setAlpha(0.5)
      .setDisplaySize(40, 40)
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.onClick()
      })

    const buttonContainer = scene.add.container(-175, 70)
    buttonContainer.add(this.image)
    container.addButton(buttonContainer)

    layerSetting(this.image, 'PlayerList')

    switcher.add('playerList', dialog, () => {
      this.deactivate()
    })
  }

  public static async build(
    scene: Scene,
    switcher: DialogSwitcher,
    dialog: IDialog,
    container: DialogButtonsContainer
  ): Promise<PlayerListButton> {
    return await new Promise<void>((resolve) => {
      if (scene.textures.exists(PLAYER_LIST_ICON_TEXTURE_NAME)) {
        resolve()
      }

      scene.load.image(PLAYER_LIST_ICON_TEXTURE_NAME, PLAYER_LIST_ICON_IMAGE_PATH)

      // textureがロードされてないときに待つ
      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.start()
    }).then(() => {
      return new PlayerListButton(scene, switcher, dialog, container)
    })
  }

  /** buttonが押されたときの動作 */
  private onClick(): void {
    // 設定画面を呼び出す
    if (this.isActivate) {
      this.switcher.close()
    } else {
      this.switcher.open('playerList', () => {
        this.activate()
      })
    }
  }

  /** buttonが有効になったときの見た目の変化 */
  public activate(): void {
    this.image.setAlpha(1)
    this.isActivate = true
  }

  /** buttonが無効になったときの見た目の変化 */
  public deactivate(): void {
    this.image.setAlpha(0.5)
    this.isActivate = false
  }
}
