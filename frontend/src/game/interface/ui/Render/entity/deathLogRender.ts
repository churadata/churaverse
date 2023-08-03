import { Scene } from 'phaser'
import { DamageMessages, IDeathLogRender } from '../../../../domain/IRender/IDeathLogRender'
import { DeathLog } from '../../../../domain/model/deathLog'
import { Interactor } from '../../../../interactor/Interactor'
import { layerSetting } from '../../util/layer'

/**
 * デスログの表示
 */
export class DeathLogRender implements IDeathLogRender {
  public interactor?: Interactor
  private readonly deathLogBuffer: string[] = []
  private readonly scene: Scene
  private intervalId: NodeJS.Timeout | null = null // タイマーIDを格納するプロパティ

  private constructor(scene: Scene) {
    this.scene = scene
  }

  public static async build(scene: Scene): Promise<DeathLogRender> {
    return new DeathLogRender(scene)
  }

  /**
   * デスログを追加する
   * @param deathLog 追加したい要素
   */
  public add(deathLog: DeathLog): void {
    const deathMessages: DamageMessages = {
      shark: ` サメの口へ ${deathLog.victim.name} がダイブ！ ${deathLog.killer.name} の勝利！`,
      bomb: ` ${deathLog.victim.name} が死亡！ ${deathLog.killer.name} の爆弾の威力半端ねえぜ！`,
    }

    const message = deathMessages[deathLog.cause]

    this.deathLogBuffer.push(message)

    if (this.intervalId === null) {
      this.startInterval() // タイマーが開始していなければ開始する
    }
  }

  private startInterval(): void {
    const interval = 300 // デスログの表示間隔を指定するためのインターバル（ミリ秒）
    const x = 25
    const y = 400
    const THICKNESS = 5 // メッセージの縁の太さ
    const MOVE_Y = 1000
    const DURATION = 10000 // ダメージが表示されて消えていく時間
    const FADE_OUT_DURATION = 1500 // メッセージのフェードアウト時間（急に消える）

    this.intervalId = setInterval(() => {
      if (this.deathLogBuffer.length === 0) {
        this.stopInterval()
        return
      }
      const message = this.deathLogBuffer.shift()
      if (message === undefined) return

      const deathMessage = this.scene.add
        .text(x, y, message, { fontSize: '24px' })
        .setOrigin(0)
        .setStroke('#505050', THICKNESS)
        .setScrollFactor(0)
      layerSetting(deathMessage, 'DeathLog')

      const fadeTween = this.scene.tweens.add({
        targets: [deathMessage],
        alpha: 0,
        duration: FADE_OUT_DURATION,
        ease: 'Quint.easeIn', // Quintic ease-in イージングを使用
        onComplete: () => {
          deathMessage.destroy()
        },
      })

      const moveTween = this.scene.tweens.add({
        targets: [deathMessage],
        x,
        y: -MOVE_Y,
        duration: DURATION,
        onComplete: () => {
          fadeTween.stop()
          moveTween.stop()
          deathMessage.destroy()
        },
      })
    }, interval)
  }

  private stopInterval(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }
}
