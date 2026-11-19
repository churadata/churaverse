import type { IGameUiComponent } from '@churaverse/game-plugin-client'

export interface IBetCoinFormContainer extends IGameUiComponent {
  postBetCoinOnTimeout: (ownPlayerId: string) => void
  open: () => void
  close: () => void
}
