import type { GameIds, GameUiRegister } from '@churaverse/game-plugin-client'
import type { IMainScene, Store } from 'churaverse-engine-client'
import { CountdownWindow } from './countdownWindow/countdownWindow'
import { CHURAREN_UI_KEYS } from './defChurarenUi'
import { ResultWindow } from './resultWindow/resultWindow'
import { TimerContainer } from './timerContainer/timerContainer'

/**
 * churarenのUIを登録する
 */
export function registerChurarenUi(_store: Store<IMainScene>, gameId: GameIds, gameUiRegister: GameUiRegister): void {
  gameUiRegister.registerGameUi(gameId, CHURAREN_UI_KEYS.COUNTDOWN_WINDOW, new CountdownWindow())
  gameUiRegister.registerGameUi(gameId, CHURAREN_UI_KEYS.TIMER_CONTAINER, new TimerContainer())
  gameUiRegister.registerGameUi(gameId, CHURAREN_UI_KEYS.RESULT_WINDOW, new ResultWindow())
}
