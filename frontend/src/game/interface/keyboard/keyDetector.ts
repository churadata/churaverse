import { Scene } from 'phaser'
import { IKeyDetector } from '../../adapter/controller/keyboard/IKeyDetector'
import { KeyCode } from '../../domain/model/core/types'

export class KeyDetector implements IKeyDetector {
  private readonly keys = new Map<KeyCode, Phaser.Input.Keyboard.Key>()

  /**
   * クラスが呼ばれた際にkeysに監視対象のkeyを加える
   * @param targets 監視対象にしたいキーのKeyCodeの配列
   */
  public constructor(scene: Scene, targets: KeyCode[]) {
    for (const keyCode of targets) {
      const key = scene.input.keyboard.addKey(keyCode, false)
      this.keys.set(keyCode, key)
    }
  }

  /**
   * 引数で受け取ったkyeCodeが押されているかを返す
   * @param keyCode
   * @returns 押されていればtrue,そうでなけれがfalse
   */
  public isPressed(keyCode: KeyCode): boolean {
    return this.keys.get(keyCode)?.isDown ?? false
  }
}
