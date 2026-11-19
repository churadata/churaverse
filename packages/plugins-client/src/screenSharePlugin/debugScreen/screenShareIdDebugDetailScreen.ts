import type { DebugDetailScreenContainer } from '@churaverse/debug-screen-plugin-client'
import { BaseDebugDetailScreen } from '@churaverse/debug-screen-plugin-client'
import type { IScreenShareIdDebugDetailScreen } from './IDebugScreen/IScreenShareInfoDebugDetailScreen'

export class ScreenShareIdDebugDetailScreen extends BaseDebugDetailScreen implements IScreenShareIdDebugDetailScreen {
  private readonly screenShareIds: Set<string> = new Set<string>()

  public constructor(debugDetailScreenContainer: DebugDetailScreenContainer) {
    const element = `Ids: 0`
    super(debugDetailScreenContainer, 'screenShareInfo', element)
  }

  public update(id: string): void {
    if (this.screenShareIds.has(id)) {
      this.screenShareIds.delete(id)
    } else {
      this.screenShareIds.add(id)
    }
    const connectedUsersCount = this.screenShareIds.size
    const idsText = connectedUsersCount > 0 ? Array.from(this.screenShareIds).join(', ') : ''
    this.content.innerText = `Ids: ${connectedUsersCount}\n${idsText}`
  }
}
