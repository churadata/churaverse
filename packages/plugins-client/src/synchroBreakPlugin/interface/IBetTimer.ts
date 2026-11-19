import type { IGameUiComponent } from '@churaverse/game-plugin-client'

export interface IBetTimer extends IGameUiComponent {
  updateTimer: (remainingTime: number) => void
  open: () => void
  close: () => void
}
