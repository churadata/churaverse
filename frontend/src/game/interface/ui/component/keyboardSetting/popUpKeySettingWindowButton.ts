import { Scene } from 'phaser'
import { Interactor } from '../../../../interactor/Interactor'
import { SettingDialog } from '../settingDialog/settingDialog'

/**
 * キー設定フォーム開くときのボタンのHTMLのkey
 */
const KEY_SETTING_BUTTON_KEY = 'keySettingButton'

/**
 * キー設定フォーム開くときのボタンのHTMLのパス
 */
const KEY_SETTING_BUTTON_PATH = 'assets/keySettingButton.html'

/**
 * キーバインドフォームを開くボタン要素のname
 */
const OPEN_POPUP_WINDOW_BUTTON_NAME = 'keySettingForm-open-button'

export class PopUpKeySettingWindowButton {
  private interactor?: Interactor

  /**
   * キーバインド設定フォーム開くボタン
   */
  private readonly formElement: Phaser.GameObjects.DOMElement

  public constructor(scene: Scene, settingDialog: SettingDialog) {
    // 入力フォームの定義
    this.formElement = scene.add
      .dom(-300, 90)
      .createFromCache(KEY_SETTING_BUTTON_KEY)
      .setOrigin(0, 0)
      .setScrollFactor(0)
    settingDialog.add(this.formElement)

    this.onClick()
  }

  public static async build(scene: Scene, settingDialog: SettingDialog): Promise<PopUpKeySettingWindowButton> {
    return await new Promise<void>((resolve) => {
      if (scene.textures.exists(KEY_SETTING_BUTTON_KEY)) {
        resolve()
      }
      // PopUpKeySettingWindowButtonの読み込み
      scene.load.html(KEY_SETTING_BUTTON_KEY, KEY_SETTING_BUTTON_PATH)

      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.start()
    }).then(() => {
      return new PopUpKeySettingWindowButton(scene, settingDialog)
    })
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }

  /**
   * キーバインド設定ウィンドウを開く
   */
  public popUpWindow(): void {
    if (this.interactor === undefined) return
    this.interactor.openKeySettingPopUpWindow()
  }

  /**
   * 開くボタンを押下した時の挙動を設定する
   */
  private onClick(): void {
    const open = this.formElement.getChildByID(OPEN_POPUP_WINDOW_BUTTON_NAME)
    if (open !== null) {
      open.addEventListener('pointerdown', () => {
        this.popUpWindow()
      })
    }
  }
}
