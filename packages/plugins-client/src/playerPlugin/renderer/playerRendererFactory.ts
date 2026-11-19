import type { Direction, Position } from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import type { IPlayerRenderer } from '../domain/IPlayerRenderer'
import type { IPlayerRendererFactory } from '../domain/IPlayerRendererFactory'
import type { PlayerColor } from '../types/playerColor'
import { PlayerRenderer } from './playerRenderer'

export class PlayerRendererFactory implements IPlayerRendererFactory {
  public constructor(private readonly scene: Scene) {}

  public build(
    position: Position,
    direction: Direction,
    name: string,
    color: PlayerColor,
    hp: number
  ): IPlayerRenderer {
    return new PlayerRenderer(this.scene, position, direction, name, color, hp)
  }
}
