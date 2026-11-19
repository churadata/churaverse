import type { DebugSummaryScreenContainer } from '@churaverse/debug-screen-plugin-client'
import { BaseDebugSummaryScreen } from '@churaverse/debug-screen-plugin-client'
import type { IPlayerIdDebugScreen } from './IDebugScreen/IPlayerInfoDebugScreen'

export class PlayerIdDebugScreen extends BaseDebugSummaryScreen implements IPlayerIdDebugScreen {
  public constructor(debugSummaryScreenContainer: DebugSummaryScreenContainer) {
    const element = `Id: undefined`
    super(debugSummaryScreenContainer, 'playerInfo', element)
  }

  public update(Id: string): void {
    this.content.textContent = `Id: ${Id}`
  }
}
