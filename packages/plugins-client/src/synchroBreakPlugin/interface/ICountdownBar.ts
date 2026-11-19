import type { IGameUiComponent } from '@churaverse/game-plugin-client'

export interface ICountdownBar extends IGameUiComponent {
  setTotalDuration: (duration: number) => void
  updateDashOffset: (remainingSeconds: number) => void
  reset: () => void
  remove: () => void
  initialize: () => void
  open: () => void
  close: () => void
}
