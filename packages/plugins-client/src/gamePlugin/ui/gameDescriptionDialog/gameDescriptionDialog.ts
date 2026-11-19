import { DomManager, domLayerSetting, type IEventBus, type IMainScene, type Store } from 'churaverse-engine-client'
import { SubmitGameJoinEvent } from '../../event/submitGameJoinEvent'
import type { GameIds } from '../../interface/gameIds'
import type { GameDescriptionDialogType, IGameDescriptionDialog } from '../../interface/IGameDescriptionDialog'
import type { IGameDescriptionDialogManager } from '../../interface/IGameDescriptionDialogManager'
import { PopupGameDescriptionDialog } from './components/PopupGameDescriptionDialog'

export const GAME_DESCRIPTION_CLOSE_BUTTON_ID = (gameId: GameIds): string => {
  return `game-detail-close-button-${gameId}`
}

export const GAME_DESCRIPTION_CONTAINER_ID = (gameId: GameIds): string => {
  return `game-detail-container-${gameId}`
}

export const GAME_JOIN_BUTTON_ID = (gameId: GameIds): string => {
  return `game-join-button-${gameId}`
}

export const GAME_DECLINE_BUTTON_ID = (gameId: GameIds): string => {
  return `game-leave-button-${gameId}`
}

export const GAME_JOIN_DECLINE_CONTAINER_ID = (gameId: GameIds): string => {
  return `game-join-buttons-container-${gameId}`
}

export abstract class GameDescriptionDialog implements IGameDescriptionDialog {
  private readonly container: HTMLElement
  private readonly gameDescriptionDialogManager: IGameDescriptionDialogManager

  public constructor(
    private readonly bus: IEventBus<IMainScene>,
    readonly store: Store<IMainScene>,
    private readonly gameId: GameIds,
    gameName: string
  ) {
    this.gameDescriptionDialogManager = store.of('gamePlugin').gameDescriptionDialogManager
    this.container = DomManager.addJsxDom(PopupGameDescriptionDialog({ gameId, gameName }))
    domLayerSetting(this.container, 'higher')
    this.close()
    this.setupCloseButton()
    this.setupJoinDeclineButtons()
  }

  public createGameDescription(detail: HTMLElement): void {
    const container = DomManager.getElementById(GAME_DESCRIPTION_CONTAINER_ID(this.gameId))
    container.appendChild(detail)
  }

  public open(type: GameDescriptionDialogType): void {
    this.container.style.display = 'block'
    switch (type) {
      case 'viewOnly':
        this.showCloseOnlyMode()
        break
      case 'joinable':
        this.showJoinableMode()
        break
    }
  }

  public close(): void {
    this.container.style.display = 'none'
  }

  private setupCloseButton(): void {
    const closeButton = DomManager.getElementById(GAME_DESCRIPTION_CLOSE_BUTTON_ID(this.gameId))
    closeButton.addEventListener('click', () => {
      this.gameDescriptionDialogManager.closeDialog()
    })
  }

  private setupJoinDeclineButtons(): void {
    const joinButton = DomManager.getElementById(GAME_JOIN_BUTTON_ID(this.gameId))
    const declineButton = DomManager.getElementById(GAME_DECLINE_BUTTON_ID(this.gameId))
    joinButton.addEventListener('click', () => {
      this.postJoinEvent(true)
      this.gameDescriptionDialogManager.closeDialog()
    })
    declineButton.addEventListener('click', () => {
      this.postJoinEvent(false)
      this.gameDescriptionDialogManager.closeDialog()
    })
  }

  private showCloseOnlyMode(): void {
    const closeButton = DomManager.getElementById(GAME_DESCRIPTION_CLOSE_BUTTON_ID(this.gameId))
    const joinDeclineContainer = DomManager.getElementById(GAME_JOIN_DECLINE_CONTAINER_ID(this.gameId))
    closeButton.style.display = 'block'
    joinDeclineContainer.style.display = 'none'
  }

  private showJoinableMode(): void {
    const closeButton = DomManager.getElementById(GAME_DESCRIPTION_CLOSE_BUTTON_ID(this.gameId))
    const joinDeclineContainer = DomManager.getElementById(GAME_JOIN_DECLINE_CONTAINER_ID(this.gameId))
    closeButton.style.display = 'none'
    joinDeclineContainer.style.display = 'flex'
  }

  private postJoinEvent(isJoined: boolean): void {
    this.bus.post(new SubmitGameJoinEvent(this.gameId, isJoined))
  }
}
