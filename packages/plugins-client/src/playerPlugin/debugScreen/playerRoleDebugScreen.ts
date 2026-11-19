import type { DebugSummaryScreenContainer } from '@churaverse/debug-screen-plugin-client'
import { BaseDebugSummaryScreen } from '@churaverse/debug-screen-plugin-client'
import type { PlayerRole } from '../types/playerRole'
import type { IPlayerRoleDebugScreen } from './IDebugScreen/IPlayerInfoDebugScreen'

export class PlayerRoleDebugScreen extends BaseDebugSummaryScreen implements IPlayerRoleDebugScreen {
  public constructor(debugSummaryScreenContainer: DebugSummaryScreenContainer) {
    const element = `Role: undefined`
    super(debugSummaryScreenContainer, 'playerInfo', element)
  }

  public update(role: PlayerRole): void {
    this.content.textContent = `Role: ${role}`
  }
}
