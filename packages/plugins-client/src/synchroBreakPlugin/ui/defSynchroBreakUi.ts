import type { IDescriptionWindow } from '../interface/IDescriptionWindow'
import type { IOwnRankingBoard } from '../interface/IOwnRankingBoard'
import type { BetCoinFormContainer } from './betCoinFormContainer/betCoinFormContainer'
import type { BetTimer } from './betTimer/betTimer'
import type { CountdownBar } from './countdownBar/countdownBar'
import type { GameSettingContainer } from './gameSettingContainer/gameSettingContainer'
import type { NyokkiButton } from './nyokkiButton/nyokkiButton'
import type { ResultScreen } from './resultScreen/resultScreen'

/**
 * SynchroBreakのUIコンポーネントを定義する
 */
declare module '@churaverse/game-plugin-client' {
  export interface GameUiMap {
    synchroBreak: {
      descriptionWindow: IDescriptionWindow
      ownRankingBoard: IOwnRankingBoard
      gameSettingConfirm: GameSettingContainer
      betCoinConfirm: BetCoinFormContainer
      nyokkiButton: NyokkiButton
      resultScreen: ResultScreen
      countdownBar: CountdownBar
      betTimer: BetTimer
    }
  }
}
