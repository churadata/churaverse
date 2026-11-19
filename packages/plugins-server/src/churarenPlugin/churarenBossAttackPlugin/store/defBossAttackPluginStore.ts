import type { IBossAttackRepository } from '../domain/IBossAttackRepository'

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    bossAttackPlugin: BossAttackPluginStore
  }
}

export interface BossAttackPluginStore {
  readonly bossAttacks: IBossAttackRepository
}
