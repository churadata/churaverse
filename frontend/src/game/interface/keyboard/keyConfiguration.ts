import { KeyCode, KeyEvent } from '../../domain/model/core/types'
import { IKeyConfiguration } from '../../interactor/IKeyConfiguration'
import { IKeyboardSetupInfoReader } from '../../interactor/keyboardSetupInfo/IKeyboardSetupInfoReader'

/**
 * キーとそのキーに紐づく処理を保持・編集するクラス
 */
export class KeyConfiguration implements IKeyConfiguration {
  public constructor(private readonly keyboardSetupInfoReader: IKeyboardSetupInfoReader) {
    this.updateFromSavedInfo()
  }

  // キー設定を初期化
  private readonly keyCodes = new Map<KeyEvent, KeyCode>([
    ['DropBomb', 'X'],
    ['ShotShark', 'Z'],
    ['EnterText', 'ENTER'],
    ['WalkUp', 'UP'],
    ['WalkDown', 'DOWN'],
    ['WalkLeft', 'LEFT'],
    ['WalkRight', 'RIGHT'],
    ['FocusShareScreen', 'V'],
  ])

  /**
   * キーバインドを変更する
   */
  public editKeyPreference(keyEvent: KeyEvent, key: KeyCode): void {
    this.keyCodes.set(keyEvent, key)
  }

  /**
   * キー設定を取得する
   */
  public getKeyPreference(): Map<KeyEvent, KeyCode> {
    return this.keyCodes
  }

  /**
   * 引数のキーイベントに設定されたキーコードを返す
   */
  public getKeyCode(keyEvent: KeyEvent): KeyCode {
    return this.keyCodes.get(keyEvent) as KeyCode
  }

  /**
   * Cookieにキー情報がある場合、Cookieのデータからイベントをキーコードがペアのマップを作成する
   */
  private updateFromSavedInfo(): Map<KeyEvent, KeyCode> {
    const keys = this.keyboardSetupInfoReader.read().keys
    if (keys === undefined) {
      return this.keyCodes
    }
    keys.forEach((keyCode, keyEvent) => {
      this.editKeyPreference(keyEvent, keyCode)
    })
    return this.keyCodes
  }
}
