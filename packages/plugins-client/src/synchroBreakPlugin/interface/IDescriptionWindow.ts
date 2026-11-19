import type { IGameUiComponent } from '@churaverse/game-plugin-client'

export interface IDescriptionWindow extends IGameUiComponent {
  setGameBaseInfo: (gameName: string, ownerName: string) => void
  displayGameStartForOwner: () => void
  displayGameStartForGuest: () => void
  displayGameSettingForOwner: (turn: number, timeLimit: string, ownCoins: number) => void
  displayGameSettingForGuest: (turn: number, timeLimit: string, ownCoins: number) => void
  displayBetCoinSelection: (betCoin: number) => void
  displayGameStartCountdown: (countdown: number) => void
  displaySynchroBreakStart: () => void
  displaySynchroBreakInProgress: (player?: string, nyokkiSuccessMessage?: string) => void
  displaySynchroBreakEnd: () => void
  displayTurnStart: (turnNumber: number, ownCoins: number) => void
  displayNyokkiAction: (text: string) => void
  displayResultMessage: () => void
  close: () => void
}
