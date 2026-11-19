import { KeyCode, KeyEvent } from '../../domain/model/core/types'
import { IPersistStore } from '../../interactor/IPersistStore'
import { IKeyboardSetupInfoReader } from '../../interactor/keyboardSetupInfo/IKeyboardSetupInfoReader'
import { KEYBOARD_SETTING_PROPERTY, KeyboardSetupInfo } from '../../interactor/keyboardSetupInfo/keyboardSetupInfo'

/**
 * キーバインドの初期情報を取得するクラス
 **/
export class KeyboardSetupInfoReader implements IKeyboardSetupInfoReader {
  public constructor(private readonly cookieRepository: IPersistStore) {}

  public read(): KeyboardSetupInfo {
    const keys = this.cookieRepository.read(KEYBOARD_SETTING_PROPERTY.keys) as string
    if (keys === undefined) {
      const info: KeyboardSetupInfo = { keys: undefined }
      return info
    }
    const deserializedMap = new Map<KeyEvent, KeyCode>(JSON.parse(decodeURIComponent(keys)))
    const info: KeyboardSetupInfo = { keys: deserializedMap }
    return info
  }
}
