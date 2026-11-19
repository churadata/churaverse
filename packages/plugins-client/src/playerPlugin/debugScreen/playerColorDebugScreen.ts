import type { DebugSummaryScreenContainer } from '@churaverse/debug-screen-plugin-client'
import { BaseDebugSummaryScreen } from '@churaverse/debug-screen-plugin-client'
import type { PlayerColor } from '../types/playerColor'
import type { IPlayerColorDebugScreen } from './IDebugScreen/IPlayerInfoDebugScreen'

export class PlayerColorDebugScreen extends BaseDebugSummaryScreen implements IPlayerColorDebugScreen {
  public constructor(debugSummaryScreenContainer: DebugSummaryScreenContainer) {
    const element = `Color: undefined`
    super(debugSummaryScreenContainer, 'playerInfo', element)
  }

  public update(color: PlayerColor): void {
    this.content.textContent = `Color: ${color}`
  }
}
