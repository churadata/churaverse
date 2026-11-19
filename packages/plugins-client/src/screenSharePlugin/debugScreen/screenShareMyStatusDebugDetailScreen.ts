import type { DebugDetailScreenContainer } from '@churaverse/debug-screen-plugin-client'
import { BaseDebugDetailScreen } from '@churaverse/debug-screen-plugin-client'
import type { IScreenShareMyStatusDebugDetailScreen } from './IDebugScreen/IScreenShareInfoDebugDetailScreen'

export class ScreenShareMyStatusDebugDetailScreen
  extends BaseDebugDetailScreen
  implements IScreenShareMyStatusDebugDetailScreen
{
  public constructor(debugDetailScreenContainer: DebugDetailScreenContainer) {
    const element = `IsOn: false`
    super(debugDetailScreenContainer, 'screenShareInfo', element)
  }

  public update(isOn: boolean): void {
    this.content.textContent = `IsOn: ${isOn.toString()}`
  }
}
