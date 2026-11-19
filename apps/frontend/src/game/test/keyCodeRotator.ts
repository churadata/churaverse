import { KeyCode } from '../domain/model/core/types'

/**
 * AutoKeyFactoryクラスを使う際に用いられるクラス
 * キーコードの保持を行い、一定時間ごとに切り替える
 */
export class KeyCodeRotator {
  public isDownKey: KeyCode
  private currentIndex: number
  private readonly keyCode: KeyCode[]
  private readonly durationMs: number

  public constructor(keyCode: KeyCode[], durationMs: number) {
    if (keyCode.length === 0) {
      throw new Error('Key codes array should not be empty.')
    }
    this.keyCode = keyCode
    this.durationMs = durationMs
    this.currentIndex = 0
    this.isDownKey = this.keyCode[this.currentIndex]
    this.rotateStart()
  }

  public rotateStart(): void {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.keyCode.length
      this.isDownKey = this.keyCode[this.currentIndex]
    }, this.durationMs)
  }
}
