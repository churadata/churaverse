import type { IBossRepository } from '../domain/IBossRepository'

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    bossPlugin: BossPluginStore
  }
}

export interface BossPluginStore {
  readonly bosses: IBossRepository
}
