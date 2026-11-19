import type { IFocusTargetRepository } from '@churaverse/core-ui-plugin-client'
import type { IMapManager } from '@churaverse/map-plugin-client'
import { mapConfig } from '@churaverse/map-plugin-client'
import { Position } from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import type { IGroundScreenRenderer } from '../interface/IGroundScreenRenderer'
import { GroundScreenRenderer } from './groundScreenRenderer'

export class GroundScreenRendererFactory {
  public constructor(
    private readonly scene: Scene,
    private readonly mapManager: IMapManager,
    private readonly focusTargetRepository: IFocusTargetRepository
  ) {}

  public build(video: HTMLVideoElement): IGroundScreenRenderer {
    const configPos = mapConfig.maps[this.mapManager.currentMap.mapId].groundScreenPos
    let pos: Position | undefined
    if (configPos !== undefined) {
      pos = Position.from(configPos)
    }
    return new GroundScreenRenderer(this.scene, this.focusTargetRepository, video, pos)
  }
}
