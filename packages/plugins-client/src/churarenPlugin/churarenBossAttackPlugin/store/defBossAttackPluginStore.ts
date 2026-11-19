import type { IBossAttackRenderer } from '../domain/IBossAttackRenderer'
import type { IBossAttackRendererFactory } from '../domain/IBossAttackRendererFactory'
import type { BossAttackRepository } from '../repository/bossAttackRepository'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    bossAttackPlugin: BossAttackPluginStore
  }
}

export interface BossAttackPluginStore {
  readonly bossAttacks: BossAttackRepository
  readonly bossAttackRenderers: Map<string, IBossAttackRenderer>
  readonly bossAttackRendererFactory: IBossAttackRendererFactory
}
