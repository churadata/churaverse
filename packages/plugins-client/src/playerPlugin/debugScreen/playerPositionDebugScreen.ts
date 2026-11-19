import type { DebugSummaryScreenContainer } from '@churaverse/debug-screen-plugin-client'
import { BaseDebugSummaryScreen } from '@churaverse/debug-screen-plugin-client'
import type { Position } from 'churaverse-engine-client'
import type { IPlayerPositionDebugScreen } from './IDebugScreen/IPlayerInfoDebugScreen'

export class PlayerPositionDebugScreen extends BaseDebugSummaryScreen implements IPlayerPositionDebugScreen {
  public constructor(debugSummaryScreenContainer: DebugSummaryScreenContainer) {
    const element = `X: undefined, Y: undefined`
    super(debugSummaryScreenContainer, 'playerInfo', element)
  }

  public update(position: Position): void {
    this.content.textContent = `X: ${position.x.toFixed(0)}, Y: ${position.y.toFixed(0)}`
  }
}

export class PlayerPositionGridDebugScreen extends BaseDebugSummaryScreen implements IPlayerPositionDebugScreen {
  public constructor(debugSummaryScreenContainer: DebugSummaryScreenContainer) {
    const element = `GridX: undefined, GridY: undefined`
    super(debugSummaryScreenContainer, 'playerInfo', element)
  }

  public update(position: Position): void {
    this.content.textContent = `GridX: ${position.gridX}, GridY: ${position.gridY}`
  }
}
