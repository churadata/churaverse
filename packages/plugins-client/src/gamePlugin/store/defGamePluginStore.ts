import type { ICountdownTimer } from '../interface/ICountdownTimer'
import type { IGameAbortAlertConfirm } from '../interface/IGameAbortAlertConfirm'
import type { IGameDescriptionDialogManager } from '../interface/IGameDescriptionDialogManager'
import type { IGameInfoRepository } from '../interface/IGameInfoRepository'
import type { IGameLogRenderer } from '../interface/IGameLogRenderer'
import type { IGameSelectionListContainer } from '../interface/IGameSelectionListContainer'
import type { IGameUiManager } from '../interface/IGameUiManager'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    gamePlugin: GamePluginStore
    gameInfo: GameInfoStore
  }
}

export interface GamePluginStore {
  readonly gameUiManager: IGameUiManager
  readonly gameLogRenderer: IGameLogRenderer
  readonly gameSelectionListContainer: IGameSelectionListContainer
  readonly gameDescriptionDialogManager: IGameDescriptionDialogManager
  readonly gameAbortAlertConfirm: IGameAbortAlertConfirm
  readonly countdownTimer: ICountdownTimer
}

export interface GameInfoStore {
  readonly games: IGameInfoRepository
}
