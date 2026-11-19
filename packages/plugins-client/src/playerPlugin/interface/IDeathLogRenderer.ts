import type { DamageCauseType } from 'churaverse-engine-client'
import type { DeathLog } from '../ui/deathLog/deathLog'

export type DeathLogMessageBuilder = (deathLog: DeathLog) => string

export interface IDeathLogRenderer {
  add: (deathLog: DeathLog) => void
  addDeathLogMessageBuilder: (damageCause: DamageCauseType, deathLogMessageBuilder: DeathLogMessageBuilder) => void
}
