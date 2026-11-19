import type { DamageCauseType } from 'churaverse-engine-client'
import type { BossDamageCauseLog } from '../ui/damageCauseLog/bossDamageCauseLog'

export type BossDamageCauseLogMessageBuilder = (damageCauseLog: BossDamageCauseLog) => string

export interface IBossDamageCauseLogRenderer {
  add: (damageCauseLog: BossDamageCauseLog) => void
  addDamageCauseLogMessageBuilder: (
    damageCause: DamageCauseType,
    damageCauseLogMessageBuilder: BossDamageCauseLogMessageBuilder
  ) => void
}
