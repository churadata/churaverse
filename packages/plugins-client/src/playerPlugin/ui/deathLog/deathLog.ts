import type { DamageCauseType } from 'churaverse-engine-client'
import type { Player } from '../../domain/player'

export interface DeathLog {
  readonly victim: Player
  readonly killer: Player | string // PvP の場合は Player、PvE（ボス等のエネミー）の場合はエネミー名の文字列
  readonly cause: DamageCauseType
  readonly diedTime: Date
}
