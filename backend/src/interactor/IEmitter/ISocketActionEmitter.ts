import { Direction } from '../../domain/core/direction'
import { Position } from '../../domain/core/position'

export interface ISocketActionEmitter {
  emitDamage: (
    attacker: string,
    target: string,
    cause: string,
    damage: number
  ) => void
  emitPlayerDie: (playerId: string) => void
  emitPlayerRespawn: (
    playerId: string,
    position: Position,
    direction: Direction
  ) => void
  emitHitShark: (sharkId: string) => void
}
