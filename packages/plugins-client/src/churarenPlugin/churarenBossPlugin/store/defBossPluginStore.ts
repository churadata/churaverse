import type { IBossRenderer } from '../domain/IBossRenderer'
import type { IBossRendererFactory } from '../domain/IBossRendererFactory'
import type { IBossDamageCauseLogRenderer } from '../interface/IBossDamageCauseLogRenderer'
import type { BossRepository } from '../repository/bossRepository'
import type { BossDamageCauseLogRepository } from '../ui/damageCauseLog/bossDamageLogRepository'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    bossPlugin: BossPluginStore
  }
}

export interface BossPluginStore {
  readonly bosses: BossRepository
  readonly bossRenderers: Map<string, IBossRenderer>
  readonly bossRendererFactory: IBossRendererFactory
  readonly damageCauseLogRenderer: IBossDamageCauseLogRenderer
  readonly damageCauseLogRepository: BossDamageCauseLogRepository
}
