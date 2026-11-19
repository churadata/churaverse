import { DomManager, domLayerSetting } from 'churaverse-engine-client'
import type { ICountdownTimer } from '../../interface/ICountdownTimer'
import { CountdownTimerComponent } from './components/CountdownTimerComponent'

export const COUNTDOWN_TIMER_ID = 'game-base-countdown-timer'

export class CountdownTimer implements ICountdownTimer {
  private intervalId: ReturnType<typeof setInterval> | null = null
  private remainingSeconds: number = 0
  private readonly element: HTMLElement

  public constructor() {
    this.element = DomManager.addJsxDom(CountdownTimerComponent())
    domLayerSetting(this.element, 'lowest')
  }

  public start(seconds: number): void {
    this.remainingSeconds = seconds
    this.element.style.display = 'flex'
    this.update()
    this.intervalId = setInterval(() => {
      this.remainingSeconds -= 1
      this.update()
      if (this.remainingSeconds < 0) {
        this.stop()
      }
    }, 1000)
  }

  private update(): void {
    const timerElement = DomManager.getElementById(COUNTDOWN_TIMER_ID)
    if (this.remainingSeconds < 0) {
      timerElement.innerHTML = ''
    } else {
      timerElement.innerHTML = `${this.remainingSeconds}`
    }
  }

  private stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  public close(): void {
    this.element.style.display = 'none'
    this.stop()
  }
}
