import { IKey } from '../../controller/IKey'
import { KeyCode, KeyDownCallback } from './types'

export class Key implements IKey {
  private readonly phaserKey: Phaser.Input.Keyboard.Key
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
    return this.phaserKey.isDown
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
