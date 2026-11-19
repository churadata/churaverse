import type { DebugDetailScreenContainer } from '@churaverse/debug-screen-plugin-client'
import { BaseDebugDetailScreen } from '@churaverse/debug-screen-plugin-client'
import type { ICollisionCountDebugDetailScreen } from './IDebugScreen/IMapInfoDebugScreen'

export class CollisionCountDebugDetailScreen extends BaseDebugDetailScreen implements ICollisionCountDebugDetailScreen {
  public constructor(debugDetailScreenContainer: DebugDetailScreenContainer) {
    const element = `CollisionCount: undefined`
    super(debugDetailScreenContainer, 'mapInfo', element)
  }

  public update(collision: number | undefined): void {
    this.content.textContent = `CollisionCount: ${collision ?? 'undefined'}`
  }
}
