import { IKey } from '../adapter/controller/keyboard/IKey'
import { KeyCode, KeyDownCallback } from '../domain/model/core/types'
import { KeyCodeRotator } from './keyCodeRotator'
import { AutoModeControlButton } from './autoModeControlButton'

/**
 * 自クラスが保持しているkeyCodeが押されているかを確認するクラス
 */
export class AutoControlledKey implements IKey {
  private readonly phaserKey: Phaser.Input.Keyboard.Key
  private readonly keyRotators: KeyCodeRotator[] = []
  private readonly autoModeControlButton: AutoModeControlButton
  private _isDown = false
  /**
   * このキーが長押しされている時間(ms)
   */
  private holdTime = 0

  public constructor(
    scene: Phaser.Scene,
    public readonly keyCode: KeyCode,
    public readonly callback: KeyDownCallback,
    public readonly duration: number,
    keyCodeRotators: KeyCodeRotator[],
    autoModeControlButton: AutoModeControlButton
  ) {
    this.keyRotators = keyCodeRotators
    this.autoModeControlButton = autoModeControlButton
    this.phaserKey = scene.input.keyboard.addKey(keyCode, false)
  }

  public get isJustDown(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.phaserKey)
  }

  /**
   * rotatorクラスでキーが押されていればtrueにして返す
   */
  public get isDown(): boolean {
    this._isDown = false
    this.keyRotators.forEach((key) => {
      if (key.isDownKey === this.keyCode) {
        this._isDown = true
      }
    })
    return this._isDown
  }

  private checkKeydown(): boolean {
    if (this.autoModeControlButton.autoMode) {
      return this.isDown
    } else {
      return this.phaserKey.isDown
    }
  }

  /**
   * duration以上長押ししていた場合true
   */
  public get isHold(): boolean {
    return this.checkKeydown() && this.holdTime >= this.duration
  }

  /**
   * 強制的にHoldTimeを0にする
   */
  public resetHoldTime(): void {
    this.holdTime = 0
  }

  /**
   * キーが押されていればholdTimeを加算、押されてなければ0にする
   */
  public updateHoldTime(dt: number): void {
    if (this.checkKeydown()) {
      this.holdTime += dt
    } else {
      this.resetHoldTime()
    }
  }
}
