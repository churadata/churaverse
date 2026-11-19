import type { DebugSummaryScreenContainer } from '@churaverse/debug-screen-plugin-client'
import { BaseDebugSummaryScreen } from '@churaverse/debug-screen-plugin-client'
import type { WorldMap } from '../domain/worldMap'
import type { IWorldSizeDebugScreen } from './IDebugScreen/IMapInfoDebugScreen'
import './defMapInfo'

export class WorldSizeDebugScreen extends BaseDebugSummaryScreen implements IWorldSizeDebugScreen {
  public constructor(debugSummaryScreenContainer: DebugSummaryScreenContainer) {
    const element = 'Map data not found'
    super(debugSummaryScreenContainer, 'worldInfo', element)
  }

  public update(map: WorldMap): void {
    this.content.textContent = `Width: ${map.width}, Height: ${map.height}`
  }
}

export class WorldSizeGridDebugScreen extends BaseDebugSummaryScreen implements IWorldSizeDebugScreen {
  public constructor(debugSummaryScreenContainer: DebugSummaryScreenContainer) {
    const element = 'Map data not found'
    super(debugSummaryScreenContainer, 'worldInfo', element)
  }

  public update(map: WorldMap): void {
    this.content.textContent = `GridWidth: ${map.widthTileNum}, GridHeight: ${map.heightTileNum}`
  }
}
