import type { CanSettingKeyActType } from '../keyboardSetting/canSettingKeyActionType'

export interface IKeyboardSettingPopUpWindow {
  closePopupWindow: () => void
  openPopupWindow: () => void
  /**
   * キーバインド設定ウィンドウで表示するキーバインドを追加する
   * @param type 追加するKeyActionのType名
   * @param description 追加するKeyActionの説明
   * @param order 数字が大きいほど下に配置される
   */
  addKeyAction: (type: CanSettingKeyActType, description: string, order?: number) => void
  /**
   * キーバインド設定ウィンドウで表示するキーバインドを削除する
   * @param type 削除するKeyActionのType名
   */
  removeKeyAction: (type: CanSettingKeyActType) => void
}
