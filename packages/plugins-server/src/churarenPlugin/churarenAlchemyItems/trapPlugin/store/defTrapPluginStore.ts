import type { ITrapRepository } from '../domain/ITrapRepository'

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    trapPlugin: TrapPluginStore
  }
}

export interface TrapPluginStore {
  readonly traps: ITrapRepository
}
