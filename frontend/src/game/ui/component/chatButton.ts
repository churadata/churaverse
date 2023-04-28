import { Scene } from 'phaser'
import { layerSetting } from '../../layer'
import { DialogSwitcher } from '../Render/dialogSwitcher'
import { IDialogButton } from '../../domain/IRender/IDialogButton'
import { IDialog } from '../../domain/IRender/IDialog'
import { DialogButtonsContainer } from '../Render/dialogButtonsContainer'
import { Badge } from './badge'

/** チャットボタンのアイコンのテクスチャ名 */
const CHAT_ICON_TEXTURE_NAME = 'chatIcon'

/** チャットボタンのアイコンのパス */
const CHAT_ICON_IMAGE_PATH = 'assets/chat.png'

export class ChatButton implements IDialogButton {
  public image: Phaser.GameObjects.Image
  private isActivate = false

  private constructor(
    private readonly scene: Scene,
    private readonly switcher: DialogSwitcher,
    private readonly dialog: IDialog,
    private readonly container: DialogButtonsContainer,
    private readonly chatBadge: Badge
  ) {
    // チャットボタンの位置･見た目設定
    this.image = scene.add
      .image(0, 0, CHAT_ICON_TEXTURE_NAME)
      .setScrollFactor(0)
      .setAlpha(0.5)
      .setDisplaySize(40, 40)
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.onClick()
      })
    chatBadge.moveTo(12, -10)

    // ボタンとチャットバッジをまとめるコンテナ
    const buttonContainer = scene.add.container(-120, 70)
    buttonContainer.add(this.image)
    buttonContainer.add(chatBadge.getGraphicsContainer())
    container.addButton(buttonContainer)

    layerSetting(this.image, 'ChatBoard')

    switcher.add('chat', dialog, () => {
      this.deactivate()
    })
  }

  public static async build(
    scene: Scene,
    switcher: DialogSwitcher,
    dialog: IDialog,
    container: DialogButtonsContainer,
    chatBadge: Badge
  ): Promise<ChatButton> {
    return await new Promise<void>((resolve) => {
      if (scene.textures.exists(CHAT_ICON_TEXTURE_NAME)) {
        resolve()
      }

      scene.load.image(CHAT_ICON_TEXTURE_NAME, CHAT_ICON_IMAGE_PATH)

      // textureがロードされてないときに待つ
      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.start()
    }).then(() => {
      return new ChatButton(scene, switcher, dialog, container, chatBadge)
    })
  }

  /** buttonが押されたときの動作 */
  private onClick(): void {
    // chatの画面を呼び出す
    if (this.isActivate) {
      this.switcher.close()
    } else {
      this.switcher.open('chat', () => {
        this.activate()
      })
    }
  }

  /** buttonが有効になったときの見た目の変化 */
  public activate(): void {
    this.image.setAlpha(1)
    this.isActivate = true
    this.chatBadge.deactivate()
  }

  /** buttonが無効になったときの見た目の変化 */
  public deactivate(): void {
    this.image.setAlpha(0.5)
    this.isActivate = false
  }
}
