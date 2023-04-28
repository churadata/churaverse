import { Scene } from 'phaser'
import { layerSetting } from '../../layer'
import { DialogSwitcher } from '../Render/dialogSwitcher'
import { IDialog } from '../../domain/IRender/IDialog'
import { IDialogButton } from '../../domain/IRender/IDialogButton'
import { DialogButtonsContainer } from '../Render/dialogButtonsContainer'

/** 設定ボタンのアイコンのテクスチャ名 */
const SETTING_ICON_TEXTURE_NAME = 'settingIcon'

/** 設定ボタンのアイコンのパス */
const SETTING_ICON_IMAGE_PATH = 'assets/gear.png'

export class SettingButton implements IDialogButton {
  public image: Phaser.GameObjects.Image
  private isActivate = false

  private constructor(
    private readonly scene: Scene,
    private readonly switcher: DialogSwitcher,
    private readonly dialog: IDialog,
    private readonly container: DialogButtonsContainer
  ) {
    // 設定ボタンの位置･見た目設定
    this.image = scene.add
      .image(-70, 70, SETTING_ICON_TEXTURE_NAME)
      .setScrollFactor(0)
      .setAlpha(0.5)
      .setDisplaySize(40, 40)
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        this.onClick()
      })

    layerSetting(this.image, 'PlayerSettingForm')
    switcher.add('setting', dialog, () => {
      this.deactivate()
    })
    container.addButton(this.image)
  }

  public static async build(
    scene: Scene,
    switcher: DialogSwitcher,
    dialog: IDialog,
    container: DialogButtonsContainer
  ): Promise<SettingButton> {
    return await new Promise<void>((resolve) => {
      if (scene.textures.exists(SETTING_ICON_TEXTURE_NAME)) {
        resolve()
      }

      scene.load.image(SETTING_ICON_TEXTURE_NAME, SETTING_ICON_IMAGE_PATH)

      // textureがロードされてないときに待つ
      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.start()
    }).then(() => {
      return new SettingButton(scene, switcher, dialog, container)
    })
  }

  /** buttonが押されたときの動作 */
  private onClick(): void {
    // 設定画面を呼び出す
    if (this.isActivate) {
      this.switcher.close()
    } else {
      this.switcher.open('setting', () => {
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
