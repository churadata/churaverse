import type { Direction, Position } from 'churaverse-engine-client'
import type { PlayerColor } from '../types/playerColor'
import type { IPlayerRenderer } from './IPlayerRenderer'

export interface IPlayerRendererFactory {
  build: (pos: Position, direction: Direction, name: string, color: PlayerColor, hp: number) => IPlayerRenderer
}
