import type { KeyboardSetupInfo } from './keyboardSetupInfo'

/**
 * キーバインド情報を読み込むためのinterface
 */
export interface IKeyboardSetupInfoReader {
  read: () => KeyboardSetupInfo
}
