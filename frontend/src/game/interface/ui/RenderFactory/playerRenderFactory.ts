import { Scene } from 'phaser'
import { IPlayerRender } from '../../../domain/IRender/IPlayerRender'
import { PlayerRender } from '../Render/entity/playerRender'
import { Position } from '../../../domain/model/core/position'
import { Direction } from '../../../domain/model/core/direction'
import { PlayerColorName } from '../../../domain/model/types'
import { IPlayerRenderFactory } from '../../../domain/IRenderFactory/IPlayerRenderFactory'

export class PlayerRenderFactory implements IPlayerRenderFactory {
  public constructor(private readonly scene: Scene) {}

  public async build(
    pos: Position,
    direction: Direction,
    name: string,
    color: PlayerColorName,
    hp: number
  ): Promise<IPlayerRender> {
    return await PlayerRender.build(this.scene, pos, direction, name, color, hp)
  }
}
