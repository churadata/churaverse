import type { GameIds, GameUiRegister } from '@churaverse/game-plugin-client'
import type { IEventBus, IMainScene, Store } from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import { BetCoinFormContainer } from './betCoinFormContainer/betCoinFormContainer'
import { BetTimer } from './betTimer/betTimer'
import { CountdownBar } from './countdownBar/countdownBar'
import { DescriptionWindow } from './descriptionWindow/descriptionWindow'
import { GameSettingContainer } from './gameSettingContainer/gameSettingContainer'
import { NyokkiButton } from './nyokkiButton/nyokkiButton'
import { OwnRankingBoard } from './rankingBoard/ownRankingBoard'
import { ResultScreen } from './resultScreen/resultScreen'

/**
 * シンクロブレイクのUIを登録する
 */
export function registerSynchroBreakUi(
  store: Store<IMainScene>,
  bus: IEventBus<IMainScene>,
  scene: Scene,
  gameId: GameIds,
  gameUiRegister: GameUiRegister
): void {
  gameUiRegister.registerGameUi(gameId, 'descriptionWindow', new DescriptionWindow())
  gameUiRegister.registerGameUi(gameId, 'ownRankingBoard', new OwnRankingBoard(store))
  gameUiRegister.registerGameUi(gameId, 'gameSettingConfirm', new GameSettingContainer(store))
  gameUiRegister.registerGameUi(gameId, 'betCoinConfirm', new BetCoinFormContainer(store))
  gameUiRegister.registerGameUi(gameId, 'nyokkiButton', new NyokkiButton(store, bus, scene))
  gameUiRegister.registerGameUi(gameId, 'resultScreen', new ResultScreen(store, bus))
  gameUiRegister.registerGameUi(gameId, 'countdownBar', new CountdownBar())
  gameUiRegister.registerGameUi(gameId, 'betTimer', new BetTimer())
}
