import type { Player } from '@churaverse/player-plugin-client'
import type { DamageCauseType } from 'churaverse-engine-client'

export interface BossDamageCauseLog {
  readonly attacker: Player
  readonly cause: DamageCauseType
  readonly damage: number
}
