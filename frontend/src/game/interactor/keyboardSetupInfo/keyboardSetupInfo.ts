import { KeyCode, KeyEvent } from '../../domain/model/core/types'

/** アプリ終了後も保存または取得するキー情報の型 */
export interface KeyboardSetupInfo {
  keys: Map<KeyEvent, KeyCode> | undefined
}

export const KEYBOARD_SETTING_PROPERTY: {
  [key in keyof KeyboardSetupInfo]: string
} = {
  keys: 'keys',
}
