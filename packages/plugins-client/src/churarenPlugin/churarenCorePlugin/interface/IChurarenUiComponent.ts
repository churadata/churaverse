import type { IGameUiComponent } from '@churaverse/game-plugin-client'
import type { ChurarenGameResultType } from '../types/uiTypes'

export interface ICountdownWindow extends IGameUiComponent {
  countdownTime: number
  startCountdown: () => void
  hideCountdown: () => void
}

export interface ITimerContainer extends IGameUiComponent {
  time: number
  startTimer: () => void
  hideTimer: () => void
}

export interface IResultWindow extends IGameUiComponent {
  showResult: (result: ChurarenGameResultType) => void
  hideResult: () => void
  buttonElement: HTMLElement
}
