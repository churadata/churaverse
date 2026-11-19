import { IKeyboardSetupInfoWriter } from '../../interactor/keyboardSetupInfo/IKeyboardSetupInfoWriter'
import { IPersistStore } from '../../interactor/IPersistStore'
import { KEYBOARD_SETTING_PROPERTY } from '../../interactor/keyboardSetupInfo/keyboardSetupInfo'
import { IKeyConfiguration } from '../../interactor/IKeyConfiguration'

// クッキーにプレイヤー情報を保存するクラス
export class KeyboardSetupInfoWriter implements IKeyboardSetupInfoWriter {
  public constructor(private readonly cookieRepository: IPersistStore) {}

  public save(keyboardPreference: IKeyConfiguration): void {
    // Mapをstringに変換してCookieに保存
    const serializedMap = JSON.stringify(Array.from(keyboardPreference.getKeyPreference().entries()))
    this.cookieRepository.save(KEYBOARD_SETTING_PROPERTY.keys, serializedMap)
  }
}
