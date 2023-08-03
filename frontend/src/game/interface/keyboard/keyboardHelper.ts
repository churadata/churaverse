import { Scene } from 'phaser'
import { Key } from './key'
import { IKeyConfiguration } from '../../interactor/IKeyConfiguration'
import { KeyCode, KeyDownCallback, KeyEvent } from '../../domain/model/core/types'
import { IKey } from '../../adapter/controller/keyboard/IKey'
import { IKeyboardHelper } from '../../adapter/controller/keyboard/IKeyboardHelper'

export class KeyboardHelper implements IKeyboardHelper {
  private readonly keys = new Map<KeyEvent, IKey>()

  public constructor(private readonly scene: Scene, private readonly keyConfiguration: IKeyConfiguration) {}

  /**
   * キー押下時の挙動を設定する
   * @param callback キーが押された瞬間か長押しのときに実行する関数
   * @param durationMs 長押し時間がこの値を超えるたびにcallbackを実行. 省略すると押されている間callbackを常に実行. nullの場合は長押し無効
   */
  public bindKey(keyEvent: KeyEvent, keyCode: KeyCode, callback: KeyDownCallback, durationMs: number | null = 0): void {
    // durationMs = nullの場合長押し無効
    durationMs ??= Infinity

    this.keys.set(keyEvent, new Key(this.scene, keyCode, callback, durationMs))
  }

  /**
   * キーとコールバックのバインドを再設定する
   * @param keyEvent キー押下げ時の処理
   * @param newKeyCode 新たに設定したいキー
   */
  public rebindKey(keyEvent: KeyEvent, newKeyCode: KeyCode): void {
    // 設定したいkeyCodeがすでに他のイベントに使用されていないか確認
    const keyCodes: IKey[] = [...this.keys.values()]
    if (keyCodes[0].keyCode.includes(newKeyCode)) {
      return
    }
    const currentKey = this.keys.get(keyEvent)
    if (currentKey === undefined) return
    this.keyConfiguration.editKeyPreference(keyEvent, newKeyCode)
    this.keys.set(keyEvent, new Key(this.scene, newKeyCode, currentKey.callback, currentKey.duration))
  }

  /**
   * キーの押下状態をチェックする.
   * 押下した瞬間 or 長押し時間が一定に達していた場合, キーに設定されているcallbackが実行される.
   */
  public update(dt: number): void {
    this.keys.forEach((key) => {
      key.updateHoldTime(dt)

      if (key.isJustDown) {
        key.callback()
      } else if (key.isHold) {
        key.callback()
        key.resetHoldTime()
      }
    })
  }
}
