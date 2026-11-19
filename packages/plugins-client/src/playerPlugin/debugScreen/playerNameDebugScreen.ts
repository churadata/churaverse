import type { DebugSummaryScreenContainer } from '@churaverse/debug-screen-plugin-client'
import { BaseDebugSummaryScreen } from '@churaverse/debug-screen-plugin-client'
import type { IPlayerNameDebugScreen } from './IDebugScreen/IPlayerInfoDebugScreen'

export class PlayerNameDebugScreen extends BaseDebugSummaryScreen implements IPlayerNameDebugScreen {
  public constructor(debugSummaryScreenContainer: DebugSummaryScreenContainer) {
    const element = `Name: undefined`
    super(debugSummaryScreenContainer, 'playerInfo', element)
  }

  public update(name: string): void {
    this.content.textContent = `Name: ${name}`
  }
}
