import { Position } from '../position'

export interface IMapRender {
  hasBlockingTile: (pos: Position) => boolean
}
