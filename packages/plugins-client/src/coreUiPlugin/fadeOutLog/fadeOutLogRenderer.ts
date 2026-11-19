import { layerSetting } from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import type { IFadeOutLogRenderer } from '../interface/IFadeOutLogRenderer'

const LOG_FONT_FAMILY =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'
/**
 * フェードアウトするログを表示するクラス
 */
export class FadeOutLogRenderer implements IFadeOutLogRenderer {
  private readonly buffer: string[] = []
  private intervalId: ReturnType<typeof setInterval> | null = null // タイマーIDを格納するプロパティ

  public constructor(
    private readonly scene: Scene,
    private readonly interval: number
  ) {}

  public add(message: string, x: number = 25, y: number = 400): void {
    this.buffer.push(message)

    if (this.intervalId === null) {
      this.startInterval(x, y) // タイマーが開始していなければ開始する
    }
  }

  private startInterval(x: number, y: number): void {
    const Thickness = 5 // メッセージの縁の太さ
    const MoveY = 1000
    const Duration = 10000 // メッセージが表示されて消えていく時間
    const FadeOutDuration = 1500 // メッセージのフェードアウト時間

    this.intervalId = setInterval(() => {
      if (this.buffer.length === 0) {
        this.stopInterval()
        return
      }
      const message = this.buffer.shift()
      if (message === undefined) return

      const fadeOutMessage = this.scene.add
        .text(x, y, message, { fontSize: '24px' })
        .setFontFamily(LOG_FONT_FAMILY)
        .setOrigin(0)
        .setStroke('#505050', Thickness)
        .setScrollFactor(0)
      layerSetting(fadeOutMessage, 'UI')

      const fadeTween = this.scene.tweens.add({
        targets: [fadeOutMessage],
        alpha: 0,
        duration: FadeOutDuration,
        ease: 'Quint.easeIn', // Quintic ease-in イージングを使用
        onComplete: () => {
          fadeOutMessage.destroy()
        },
      })

      const moveTween = this.scene.tweens.add({
        targets: [fadeOutMessage],
        x,
        y: -MoveY,
        duration: Duration,
        onComplete: () => {
          fadeTween.stop()
          moveTween.stop()
          fadeOutMessage.destroy()
        },
      })
    }, this.interval)
  }

  private stopInterval(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  public destroy(): void {
    this.stopInterval()
  }
}
