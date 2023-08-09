import { IKey } from '../adapter/controller/keyboard/IKey'
import { KeyCode, KeyDownCallback } from '../domain/model/core/types'

/**
 * エイジングテスト用のkeyクラス
 * テストの際はKeyの代わりにAgingTestKeyクラスのインスタンスを用いる
 */
export class AgingTestKey implements IKey {
  private readonly phaserKey: Phaser.Input.Keyboard.Key
  private _isDown = false
  /**
   * このキーが長押しされている時間(ms)
   */
  private holdTime = 0

  public constructor(
    scene: Phaser.Scene,
    public readonly keyCode: KeyCode,
    public readonly callback: KeyDownCallback,
    public readonly duration: number
  ) {
    this.phaserKey = scene.input.keyboard.addKey(keyCode, false)
    this.startTogglingKeyState()
  }

  /**
   * キーを押下した瞬間のみtrue
   */
  public get isJustDown(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.phaserKey)
  }

  /**
   * キーが押されていればtrue
   */
  public get isDown(): boolean {
    return this._isDown
  }

  /**
   * duration以上長押ししていた場合true
   */
  public get isHold(): boolean {
    return this.isDown && this.holdTime >= this.duration
  }

  /**
   * 強制的にHoldTimeを0にする
   */
  public resetHoldTime(): void {
    this.holdTime = 0
  }

  /**
   * keyの押/離の切り替えを1秒ごとに行う
   */
  private startTogglingKeyState(): void {
    const MAX_INTERVAL = 1000 * Math.random()
    this._isDown = !this._isDown
    setTimeout(() => {
      this.startTogglingKeyState()
    }, MAX_INTERVAL)
  }

  /**
   * キーが押されていればholdTimeを加算、押されてなければ0にする
   */
  public updateHoldTime(dt: number): void {
    if (this.isDown) {
      this.holdTime += dt
    } else {
      this.resetHoldTime()
    }
  }
}
