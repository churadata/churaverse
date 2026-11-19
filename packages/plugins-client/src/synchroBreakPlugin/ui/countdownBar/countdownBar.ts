import { DomManager } from 'churaverse-engine-client'
import type { ICountdownBar } from '../../interface/ICountdownBar'
import { CountdownBarComponent } from './component/CountDownBarComponent'
import styles from './component/CountDownBarComponent.module.scss'

export const COUNTDOWN_BAR_PROGRESS_VALUE_ID = 'countdown-bar-progress-value'
export const COUNTDOWN_BAR_PROGRESS_BAR_ID = 'countdown-bar-progress-bar'

/**
 * 円形カウントダウンバー
 * - 中央に残り秒数を表示（percent をそのまま数値表示）
 */
export class CountdownBar implements ICountdownBar {
  public element!: HTMLElement
  public readonly visible: boolean = false

  private totalDuration: number = 1
  private lastRemainingSeconds?: number
  private readonly alertThreshold: number = 3
  private progressBarEl!: HTMLElement
  private progressValueEl!: HTMLElement

  private readonly radius = 45
  private readonly circumference = this.radius * 2 * Math.PI

  private static readonly DEFAULT_TRANSITION = 'stroke-dashoffset 1s linear, stroke 0.3s ease'
  private static readonly LAG_THRESHOLD_SECONDS = 2

  public initialize(): void {
    this.element?.remove()

    this.element = DomManager.addJsxDom(CountdownBarComponent())
    this.element.style.display = 'none'

    this.progressValueEl = DomManager.getElementById(COUNTDOWN_BAR_PROGRESS_VALUE_ID)
    this.progressBarEl = DomManager.getElementById(COUNTDOWN_BAR_PROGRESS_BAR_ID)

    this.progressBarEl.style.strokeDasharray = `${this.circumference}`
    this.progressBarEl.style.strokeDashoffset = `${this.circumference}`
  }

  /**
   * 全体の時間を設定する
   */
  public setTotalDuration(duration: number): void {
    this.totalDuration = Math.max(duration, 1)
  }

  /**
   * サーバ同期型の描画更新。残り秒から比率を計算して stroke-dashoffset を更新する。
   */
  public updateDashOffset(remainingSeconds: number): void {
    // 残り秒数表示を更新
    const newText = Math.floor(remainingSeconds).toString()
    this.progressValueEl.textContent = newText

    if (this.lastRemainingSeconds === undefined) {
      this.initializeProgress(remainingSeconds)
      this.updateProgressBar(remainingSeconds, remainingSeconds)
    } else {
      this.updateProgressBar(remainingSeconds, this.lastRemainingSeconds)
    }
    this.lastRemainingSeconds = remainingSeconds
  }

  /**
   * プログレスバーと秒数表示の初期化
   */
  private initializeProgress(remainingSeconds: number): void {
    this.progressValueEl.textContent = Math.floor(remainingSeconds).toString()

    this.progressBarEl.style.transition = 'none'
    const offset = this.calculateStrokeDashOffset(remainingSeconds)
    this.progressBarEl.style.strokeDashoffset = `${offset}`
    this.progressBarEl.getBoundingClientRect()
    this.progressBarEl.style.transition = CountdownBar.DEFAULT_TRANSITION

    this.updateAlertState(remainingSeconds)
  }

  /**
   * プログレスバーの描画を更新する
   * 現在の秒数から次の秒へ1秒かけてトランジション
   */
  private updateProgressBar(remainingSeconds: number, lastRemainingSeconds: number): void {
    this.updateAlertState(remainingSeconds)

    // 大きなラグがあった場合はトランジションなしで即座に更新
    const isLargeLag = Math.abs(remainingSeconds - lastRemainingSeconds) > CountdownBar.LAG_THRESHOLD_SECONDS
    if (isLargeLag) {
      const prevTransition = this.progressBarEl.style.transition
      this.progressBarEl.style.transition = 'none'
      const currentOffset = this.calculateStrokeDashOffset(remainingSeconds)
      this.progressBarEl.style.strokeDashoffset = `${currentOffset}`
      this.progressBarEl.getBoundingClientRect()

      requestAnimationFrame(() => {
        this.progressBarEl.style.transition = prevTransition !== '' ? prevTransition : CountdownBar.DEFAULT_TRANSITION
      })
    } else {
      // 現在の秒数から次の秒へトランジション
      if (this.progressBarEl.style.transition === '') {
        this.progressBarEl.style.transition = CountdownBar.DEFAULT_TRANSITION
      }
      const nextOffset = this.calculateStrokeDashOffset(remainingSeconds - 1)
      this.progressBarEl.style.strokeDashoffset = `${nextOffset}`
    }
  }

  /**
   * カウントダウンバーのオフセットを計算する
   */
  private calculateStrokeDashOffset(remainingSeconds: number): number {
    const total = this.totalDuration > 0 ? this.totalDuration : 1
    const ratio = Math.max(0, Math.min(1, remainingSeconds / total))
    const offset = this.circumference * (1 - ratio)
    return offset
  }

  /**
   * 警告状態の切り替え
   */
  private updateAlertState(remainingSeconds: number): void {
    if (remainingSeconds <= this.alertThreshold) {
      this.progressBarEl.classList.add(styles.alert)
    } else {
      this.progressBarEl.classList.remove(styles.alert)
    }
  }

  public open(): void {
    this.element.style.display = 'block'
  }

  public close(): void {
    this.element.style.display = 'none'
  }

  public reset(): void {
    this.lastRemainingSeconds = undefined

    this.progressValueEl.textContent = '0'

    this.progressBarEl.style.transition = 'none'
    this.progressBarEl.style.strokeDashoffset = `${this.circumference}`
  }

  public remove(): void {
    this.element.remove()
  }
}
