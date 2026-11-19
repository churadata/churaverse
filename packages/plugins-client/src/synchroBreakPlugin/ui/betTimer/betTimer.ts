import { DomManager, domLayerSetting, makeLayerHigherTemporary } from 'churaverse-engine-client'
import type { IBetTimer } from '../../interface/IBetTimer'
import { BET_TIMER_TIME_LIMIT } from '../../synchroBreakPlugin'
import { BetTimerComponent } from './component/BetTimerComponent'

export const BET_TIMER_CONTAINER_ID = 'betcoin-progressbar-container'
export const BET_TIMER_ID = 'betcoin-progressbar'

export class BetTimer implements IBetTimer {
  public element!: HTMLElement
  private betTimer!: HTMLElement
  public readonly visible: boolean = false

  public initialize(): void {
    this.setBetTimerContainer()
    this.betTimer = DomManager.getElementById(BET_TIMER_ID)
  }

  private setBetTimerContainer(): void {
    this.element = DomManager.addJsxDom(BetTimerComponent())
    domLayerSetting(this.element, 'lowest')
    this.element.addEventListener('click', () => {
      makeLayerHigherTemporary(this.element, 'lower')
    })
  }

  public updateTimer(remainingTime: number): void {
    this.betTimer.style.width = `${(remainingTime / BET_TIMER_TIME_LIMIT) * 100}%`
  }

  public open(): void {
    this.element.style.display = 'block'
    this.betTimer.style.width = '100%'
  }

  public close(): void {
    this.element.style.display = 'none'
  }

  public remove(): void {
    this.element.remove()
  }
}
