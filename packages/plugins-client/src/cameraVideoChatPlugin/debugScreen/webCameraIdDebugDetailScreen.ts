import type { DebugDetailScreenContainer } from '@churaverse/debug-screen-plugin-client'
import { BaseDebugDetailScreen } from '@churaverse/debug-screen-plugin-client'
import type { IWebCameraIdDebugDetailScreen } from './IDebugScreen/IWebCameraInfoDebugScreen'

export class WebCameraIdDebugDetailScreen extends BaseDebugDetailScreen implements IWebCameraIdDebugDetailScreen {
  private readonly cameraIds: Set<string> = new Set<string>()

  public constructor(debugDetailScreenContainer: DebugDetailScreenContainer) {
    const element = `Ids: 0`
    super(debugDetailScreenContainer, 'webCameraInfo', element)
  }

  public update(id: string): void {
    if (this.cameraIds.has(id)) {
      this.cameraIds.delete(id)
    } else {
      this.cameraIds.add(id)
    }
    const connectedUsersCount = this.cameraIds.size
    const idsText = connectedUsersCount > 0 ? Array.from(this.cameraIds).join(', ') : ''
    this.content.innerText = `Ids: ${connectedUsersCount}\n${idsText}`
  }
}
