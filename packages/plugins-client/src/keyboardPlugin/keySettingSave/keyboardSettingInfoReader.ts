import type { IPersistStore } from '@churaverse/data-persistence-plugin-client'
import type { IKeyboardSetupInfoReader } from '../interface/keySettingSave/IKeyboardSetupInfoReader'
import { KEYBOARD_SETTING_PROPERTY, type KeyboardSetupInfo } from '../interface/keySettingSave/keyboardSetupInfo'
import type { KeyCode } from '../types/keyCode'
import type { CanSettingKeyActType } from '../ui/keyboardSetting/canSettingKeyActionType'

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
    const deserializedMap = new Map<CanSettingKeyActType, KeyCode>(JSON.parse(decodeURIComponent(keys)))
    const info: KeyboardSetupInfo = { keys: deserializedMap }
    return info
  }
}
