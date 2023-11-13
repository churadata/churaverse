import { Scene } from 'phaser'
import { Interactor } from '../../../../interactor/Interactor'
import { SettingDialog } from '../settingDialog/settingDialog'
import { SettingSection } from '../settingDialog/settingSection'
import { DomManager } from '../../util/domManager'
import { PopupKeySettingWindowButtonComponent } from './components/PopupKeySettingWindowButtonComponent'

/**
 * キーバインドフォームを開くボタン要素のid
 */
export const POPUP_KEY_SETTING_WINDOW_BUTTON_ID = 'keySettingForm-open-button'

export class PopUpKeySettingWindowButton {
  private interactor?: Interactor

  public constructor(scene: Scene, settingDialog: SettingDialog) {
    const keyboardSection = new SettingSection('keyboardSetting', 'キーボード設定')
    settingDialog.addSection(keyboardSection)

    const content = DomManager.jsxToDom(PopupKeySettingWindowButtonComponent())
    settingDialog.addContent('keyboardSetting', content)

    this.setupPopupButton()
  }

  public static async build(scene: Scene, settingDialog: SettingDialog): Promise<PopUpKeySettingWindowButton> {
    return new PopUpKeySettingWindowButton(scene, settingDialog)
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
  private setupPopupButton(): void {
    const button = DomManager.getElementById(POPUP_KEY_SETTING_WINDOW_BUTTON_ID)

    button.onclick = () => {
      this.popUpWindow()
    }
  }
}

declare module '../settingDialog/settingDialog' {
  export interface SettingDialogSectionMap {
    keyboardSetting: SettingSection
  }
}
