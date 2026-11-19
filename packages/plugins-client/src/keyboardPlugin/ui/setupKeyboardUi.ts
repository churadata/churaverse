import { SettingSection } from '@churaverse/core-ui-plugin-client'
import type { IMainScene, Store } from 'churaverse-engine-client'
import type { IKeyActionRegister } from '../interface/IKeyActionRegister'
import { KeyboardSettingPopUpWindow } from './keyboardSetting/keySettingPopUpWindow'
import { PopUpKeySettingWindowButton } from './keyboardSetting/popUpKeySettingWindowButton'

export function setupKeyboardUi(store: Store<IMainScene>, keyActionRegister: IKeyActionRegister<IMainScene>): void {
  const uiStore = store.of('coreUiPlugin')
  const keyboardStore = store.of('keyboardPlugin')
  uiStore.settingDialog.addSection(new SettingSection('keyboardSetting', 'キーボード設定'))
  const keyboardSettingWindow = new KeyboardSettingPopUpWindow(keyboardStore.keyActionRebinder, keyActionRegister)
  void new PopUpKeySettingWindowButton(uiStore.settingDialog, keyboardSettingWindow)
  keyboardStore.keySettingWindow = keyboardSettingWindow
}
