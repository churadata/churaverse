import { DomManager, domLayerSetting } from 'churaverse-engine-client'
import type { ICountdownWindow } from '../../interface/IChurarenUiComponent'
import { CountdownWindowComponent } from './component/CountdownWindowComponent'

export const CHURAREN_GAME_START_COUNTDOWN_ID = 'churaren-game-start-countdown'
const COUNTDOWN_TIME_SECONDS = 3

export class CountdownWindow implements ICountdownWindow {
  public countdownTime: number = 0
  public visible: boolean = false
  public element!: HTMLElement
  private intervalId: ReturnType<typeof setInterval> | null = null

  public initialize(): void {
    this.element = DomManager.addJsxDom(CountdownWindowComponent())
    domLayerSetting(this.element, 'lowest')
  }

  public startCountdown(): void {
    this.countdownTime = COUNTDOWN_TIME_SECONDS
    this.element.style.display = 'flex'
    this.updateCountdown()
    this.intervalId = setInterval(() => {
      this.countdownTime--
      if (this.countdownTime < -1) {
        this.stopInterval()
      } else {
        this.updateCountdown()
      }
    }, 1000)
  }

  private updateCountdown(): void {
    const countdownElement = DomManager.getElementById(CHURAREN_GAME_START_COUNTDOWN_ID)
    if (this.countdownTime === 0) {
      countdownElement.innerHTML = 'START!'
    } else if (this.countdownTime === -1) {
      this.hideCountdown()
    } else {
      countdownElement.innerHTML = `開始まで<br> ${this.countdownTime} 秒`
    }
  }

  private stopInterval(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  public hideCountdown(): void {
    this.element.style.display = 'none'
  }

  public remove(): void {
    this.stopInterval()
    this.element.parentNode?.removeChild(this.element)
  }
}
