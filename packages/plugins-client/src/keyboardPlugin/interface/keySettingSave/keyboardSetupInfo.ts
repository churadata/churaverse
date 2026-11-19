import type { KeyCode } from '../../types/keyCode'
import type { CanSettingKeyActType } from '../../ui/keyboardSetting/canSettingKeyActionType'

/** アプリ終了後も保持するキー情報の型 */
export interface KeyboardSetupInfo {
  keys: Map<CanSettingKeyActType, KeyCode> | undefined
}

export const KEYBOARD_SETTING_PROPERTY: {
  [key in keyof KeyboardSetupInfo]: string
} = {
  keys: 'keys',
}
