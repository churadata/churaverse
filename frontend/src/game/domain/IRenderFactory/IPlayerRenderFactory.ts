import { IPlayerRender } from '../IRender/IPlayerRender'
import { Direction } from '../model/core/direction'
import { Position } from '../model/core/position'
import { PlayerColorName } from '../model/types'

export interface IPlayerRenderFactory {
  build: (
    pos: Position,
    direction: Direction,
    name: string,
    color: PlayerColorName,
    hp: number
  ) => Promise<IPlayerRender>
}
