import { Scene, Tilemaps } from 'phaser'
import { IPlayerRender } from '../../../domain/IRender/IPlayerRender'
import { PlayerRender } from '../Render/entity/playerRender'
import { Position } from '../../../domain/model/core/position'
import { Direction } from '../../../domain/model/core/direction'
import { PlayerColorName } from '../../../domain/model/types'
import { IPlayerRenderFactory } from '../../../domain/IRenderFactory/IPlayerRenderFactory'

export class PlayerRenderFactory implements IPlayerRenderFactory {
  public constructor(private readonly scene: Scene, private readonly mapLayer: Tilemaps.TilemapLayer) {}

  public async build(
    pos: Position,
    direction: Direction,
    name: string,
    color: PlayerColorName
  ): Promise<IPlayerRender> {
    return await PlayerRender.build(this.scene, this.mapLayer, pos, direction, name, color)
  }
}
