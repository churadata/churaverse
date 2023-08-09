import { IKeyConfiguration } from '../IKeyConfiguration'

/**
 * interactorからキーボードの情報を保存するためのinterface
 */
export interface IKeyboardSetupInfoWriter {
  save: (keyboardPreference: IKeyConfiguration) => void
}
