import { Direction } from '../../domain/core/direction'
import { Position } from '../../domain/core/position'
import { DamageCause } from '../../domain/model/deathLog'

export interface ISocketActionEmitter {
  emitDamage: (attacker: string, target: string, cause: DamageCause, damage: number) => void
  emitPlayerDie: (playerId: string) => void
  emitPlayerRespawn: (playerId: string, position: Position, direction: Direction) => void
  emitHitShark: (sharkId: string) => void
}
