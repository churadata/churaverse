import type { IPersistStore } from '@churaverse/data-persistence-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'
import type { IKeyboardSetupInfoWriter } from '../interface/keySettingSave/IKeyboardSetupInfoWriter'
import { KEYBOARD_SETTING_PROPERTY } from '../interface/keySettingSave/keyboardSetupInfo'
import type { KeyAction } from '../keyAction/keyAction'

// クッキーにプレイヤー情報を保存するクラス
export class KeyboardSetupInfoWriter implements IKeyboardSetupInfoWriter {
  public constructor(private readonly cookieRepository: IPersistStore) {}

  public save(keyActions: Array<KeyAction<IMainScene>>): void {
    // Mapをstringに変換してCookieに保存
    const serializedMap = JSON.stringify(keyActions.map((keyAct) => [keyAct.type, keyAct.keyCode]))
    this.cookieRepository.save(KEYBOARD_SETTING_PROPERTY.keys, serializedMap)
  }
}
