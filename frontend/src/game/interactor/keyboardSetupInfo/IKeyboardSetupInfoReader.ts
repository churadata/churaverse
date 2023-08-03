import { KeyboardSetupInfo } from './keyboardSetupInfo'

/**
 * interactorからキーバインド情報を読み込むためのinterface
 */
export interface IKeyboardSetupInfoReader {
  read: () => KeyboardSetupInfo
}
