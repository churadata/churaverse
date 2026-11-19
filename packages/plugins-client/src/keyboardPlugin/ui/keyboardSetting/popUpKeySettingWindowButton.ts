import type { ISettingDialog } from '@churaverse/core-ui-plugin-client'
import { DomManager } from 'churaverse-engine-client'
import type { IKeyboardSettingPopUpWindow } from '../interface/IKeySettingPopUpWindow'
import { PopupKeySettingWindowButtonComponent } from './components/PopupKeySettingWindowButtonComponent'
// keyboardPluginのStoreInMain/StoreInTitle拡張(declare module)を読み込むためだけのimport。値としては使用しない
import '../../store/defKeyboardPluginStore'
/**
 * キーバインドフォームを開くボタン要素のid
 */
export const POPUP_KEY_SETTING_WINDOW_BUTTON_ID = 'keySettingForm-open-button'

export class PopUpKeySettingWindowButton {
  public constructor(
    settingDialog: ISettingDialog,
    private readonly popupWindow: IKeyboardSettingPopUpWindow
  ) {
    const content = DomManager.jsxToDom(PopupKeySettingWindowButtonComponent())
    settingDialog.addContent('keyboardSetting', content)

    this.setupPopupButton()
  }

  /**
   * キーバインド設定ウィンドウを開く
   */
  public popUpWindow(): void {
    this.popupWindow.openPopupWindow()
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
