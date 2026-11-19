import type { IMainScene, Store } from 'churaverse-engine-client'
import { GameDescriptionDialogManager } from '../gameDescriptionDialogManager'
import { GameUiManager } from '../gameUiManager'
import type { GameUiRegister } from '../gameUiRegister'
import { GameInfoRepository } from '../repository/gameInfoRepository'
import { GameAbortAlertConfirm } from '../ui/abort/gameAbortAlerConfirm'
import { CountdownTimer } from '../ui/countdownTimer/countdownTimer'
import { GameSelectionListContainer } from '../ui/gameList/gameSelectionListContainer'
import { GameLogRenderer } from '../ui/logRenderer/gameLogRenderer'
import type { GameInfoStore, GamePluginStore } from './defGamePluginStore'

export function initGamePluginStore(store: Store<IMainScene>, gameUiRegister: GameUiRegister): void {
  const pluginStore: GamePluginStore = {
    gameUiManager: new GameUiManager(gameUiRegister),
    gameLogRenderer: new GameLogRenderer(store),
    gameSelectionListContainer: new GameSelectionListContainer(),
    gameDescriptionDialogManager: new GameDescriptionDialogManager(),
    gameAbortAlertConfirm: new GameAbortAlertConfirm(),
    countdownTimer: new CountdownTimer(),
  }
  const gameInfoStore: GameInfoStore = { games: new GameInfoRepository() }

  store.setInit('gamePlugin', pluginStore)
  store.setInit('gameInfo', gameInfoStore)
}
