import type { DebugSummaryScreenContainer } from '@churaverse/debug-screen-plugin-client'
import { BaseDebugSummaryScreen } from '@churaverse/debug-screen-plugin-client'
import type { IPlayerHpDebugScreen } from './IDebugScreen/IPlayerInfoDebugScreen'

export class PlayerHpDebugScreen extends BaseDebugSummaryScreen implements IPlayerHpDebugScreen {
  public constructor(debugSummaryScreenContainer: DebugSummaryScreenContainer) {
    const element = `Hp: undefined`
    super(debugSummaryScreenContainer, 'playerInfo', element)
  }

  public update(hp: number): void {
    this.content.textContent = `Hp: ${hp}`
  }
}
