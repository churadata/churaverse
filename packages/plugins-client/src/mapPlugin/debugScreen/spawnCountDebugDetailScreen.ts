import type { DebugDetailScreenContainer } from '@churaverse/debug-screen-plugin-client'
import { BaseDebugDetailScreen } from '@churaverse/debug-screen-plugin-client'
import type { ISpawnCountDebugDetailScreen } from './IDebugScreen/IMapInfoDebugScreen'

export class SpawnCountDebugDetailScreen extends BaseDebugDetailScreen implements ISpawnCountDebugDetailScreen {
  public constructor(debugDetailScreenContainer: DebugDetailScreenContainer) {
    const element = `SpawnCount: undefined`
    super(debugDetailScreenContainer, 'mapInfo', element)
  }

  public update(spawn: number | undefined): void {
    this.content.textContent = `SpawnCount: ${spawn ?? 'undefined'}`
  }
}
