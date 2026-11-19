import type { DebugSummaryScreenContainer } from '@churaverse/debug-screen-plugin-client'
import { BaseDebugSummaryScreen } from '@churaverse/debug-screen-plugin-client'
import { type Direction, vectorToName } from 'churaverse-engine-client'
import type { IPlayerDirectionDebugScreen } from './IDebugScreen/IPlayerInfoDebugScreen'

export class PlayerDirectionDebugScreen extends BaseDebugSummaryScreen implements IPlayerDirectionDebugScreen {
  public constructor(debugSummaryScreenContainer: DebugSummaryScreenContainer) {
    const element = `Direction: undefined`
    super(debugSummaryScreenContainer, 'playerInfo', element)
  }

  public update(direction: Direction): void {
    this.content.textContent = `Direction: ${vectorToName(direction)}`
  }
}
