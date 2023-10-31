import { Scene } from 'phaser'
import { IFadeOutLogRender } from '../../../../domain/IRender/IFadeOutLogRender'
import { Interactor } from '../../../../interactor/Interactor'
import { layerSetting } from '../../util/canvasLayer'

/**
 * フェードアウトするログを表示するクラス
 */
export class FadeOutLogRender implements IFadeOutLogRender {
  public interactor?: Interactor
  private readonly buffer: string[] = []
  private readonly scene: Scene
  private readonly interval: number
  private intervalId: NodeJS.Timeout | null = null // タイマーIDを格納するプロパティ

  private constructor(scene: Scene, interval: number) {
    this.scene = scene
    this.interval = interval
  }

  public static async build(scene: Scene, interval: number): Promise<FadeOutLogRender> {
    return new FadeOutLogRender(scene, interval)
  }

  public add(message: string, x: number = 25, y: number = 400): void {
    if (!this.scene.scene.isActive('Main')) return
    this.buffer.push(message)

    if (this.intervalId === null) {
      this.startInterval(x, y) // タイマーが開始していなければ開始する
    }
  }

  private startInterval(x: number, y: number): void {
    const THICKNESS = 5 // メッセージの縁の太さ
    const MOVE_Y = 1000
    const DURATION = 10000 // メッセージが表示されて消えていく時間
    const FADE_OUT_DURATION = 1500 // メッセージのフェードアウト時間

    this.intervalId = setInterval(() => {
      if (this.buffer.length === 0) {
        this.stopInterval()
        return
      }
      const message = this.buffer.shift()
      if (message === undefined) return

      const fadeOutMessage = this.scene.add
        .text(x, y, message, { fontSize: '24px' })
        .setOrigin(0)
        .setStroke('#505050', THICKNESS)
        .setScrollFactor(0)
      layerSetting(fadeOutMessage, 'UI')

      const fadeTween = this.scene.tweens.add({
        targets: [fadeOutMessage],
        alpha: 0,
        duration: FADE_OUT_DURATION,
        ease: 'Quint.easeIn', // Quintic ease-in イージングを使用
        onComplete: () => {
          fadeOutMessage.destroy()
        },
      })

      const moveTween = this.scene.tweens.add({
        targets: [fadeOutMessage],
        x,
        y: -MOVE_Y,
        duration: DURATION,
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

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }
}
