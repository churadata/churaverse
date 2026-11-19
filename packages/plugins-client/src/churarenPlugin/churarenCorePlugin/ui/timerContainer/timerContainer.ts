import { DomManager, domLayerSetting } from 'churaverse-engine-client'
import type { ITimerContainer } from '../../interface/IChurarenUiComponent'
import { TimerContainerComponent } from './component/TimerContainerComponent'

export const GAME_COUNTDOWN_TIMER_ID = 'churaren-game-countdown-timer'
export const TIME_LIMIT_MINUTES = 3 * 60 // 制限時間(分)

export class TimerContainer implements ITimerContainer {
  public element!: HTMLElement
  public visible: boolean = false
  public time: number = TIME_LIMIT_MINUTES
  private animationFrameId: number | null = null

  public initialize(): void {
    this.element = DomManager.addJsxDom(TimerContainerComponent())
    domLayerSetting(this.element, 'lowest')
  }

  public startTimer(): void {
    this.element.style.display = 'flex'
    const timerWindowElement = DomManager.getElementById(GAME_COUNTDOWN_TIMER_ID)
    const startTime = Date.now()
    const endTime = startTime + this.time * 1000 + 1000 // 出力誤差を考慮して1秒追加
    const updateTimer = (): void => {
      if (timerWindowElement === null) return
      const currentTime = Date.now()
      const remainingTime = endTime - currentTime
      if (remainingTime <= 0) {
        timerWindowElement.innerHTML = '0:00'
        // ゲーム終了処理を行う
        setTimeout(() => {
          this.hideTimer()
        }, 1000)
        return
      }
      const remainingMinutes = Math.floor(remainingTime / 60000)
      const remainingSeconds = Math.floor((remainingTime % 60000) / 1000)
      timerWindowElement.innerHTML = `${remainingMinutes}:${remainingSeconds.toString().padStart(2, '0')}`
      this.animationFrameId = requestAnimationFrame(updateTimer)
    }
    updateTimer()
  }

  public remove(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
    this.element.parentNode?.removeChild(this.element)
  }

  public hideTimer(): void {
    this.element.style.display = 'none'
  }
}
