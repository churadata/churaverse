import type { DebugDetailScreenContainer } from '@churaverse/debug-screen-plugin-client'
import { BaseDebugDetailScreen } from '@churaverse/debug-screen-plugin-client'
import type { IWebCameraMyStatusDebugDetailScreen } from './IDebugScreen/IWebCameraInfoDebugScreen'

export class WebCameraMyStatusDebugDetailScreen
  extends BaseDebugDetailScreen
  implements IWebCameraMyStatusDebugDetailScreen
{
  public constructor(debugDetailScreenContainer: DebugDetailScreenContainer) {
    const element = `IsOn: false`
    super(debugDetailScreenContainer, 'webCameraInfo', element)
  }

  public update(isOn: boolean): void {
    this.content.textContent = `IsOn: ${isOn.toString()}`
  }
}
