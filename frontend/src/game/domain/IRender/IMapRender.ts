import { Position } from '../model/core/position'

export interface IMapRender {
  hasBlockingTile: (pos: Position) => boolean
}
