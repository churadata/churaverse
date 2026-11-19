import type { DebugDetailScreenContainer } from '@churaverse/debug-screen-plugin-client'
import { BaseDebugDetailScreen } from '@churaverse/debug-screen-plugin-client'
import type { ISharkCountDebugDetailScreen } from './IDebugScreen/ISharkCountDebugDetailScreen'

export class SharkCountDebugDetailScreen extends BaseDebugDetailScreen implements ISharkCountDebugDetailScreen {
  public constructor(debugDetailScreenContainer: DebugDetailScreenContainer) {
    const element = `SharkCount: undefined`
    super(debugDetailScreenContainer, 'sharkInfo', element)
  }

  public update(sharkCount: number): void {
    this.content.textContent = `SharkCount: ${sharkCount}`
  }
}
