import { DamageCause } from '../IRender/IDeathLogRender'
import { Player } from './player'

export interface DeathLog {
  readonly victim: Player
  readonly killer: Player
  readonly cause: DamageCause
  readonly diedTime: Date
}
