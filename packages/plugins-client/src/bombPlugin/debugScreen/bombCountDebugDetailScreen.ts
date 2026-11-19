import type { DebugDetailScreenContainer } from '@churaverse/debug-screen-plugin-client'
import { BaseDebugDetailScreen } from '@churaverse/debug-screen-plugin-client'
import type { IBombCountDebugDetailScreen } from './IDebugScreen/IBombCountDebugDetailScreen'

export class BombCountDebugDetailScreen extends BaseDebugDetailScreen implements IBombCountDebugDetailScreen {
  public constructor(debugDetailScreenContainer: DebugDetailScreenContainer) {
    const element = `BombCount: undefined`
    super(debugDetailScreenContainer, 'bombInfo', element)
  }

  public update(bombCount: number): void {
    this.content.textContent = `BombCount: ${bombCount}`
  }
}
