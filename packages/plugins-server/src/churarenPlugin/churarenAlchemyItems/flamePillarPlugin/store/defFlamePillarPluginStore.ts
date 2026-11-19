import type { IFlamePillarRepository } from '../domain/IFlamePillarRepository'

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    flamePillarPlugin: FlamePillarPluginStore
  }
}

export interface FlamePillarPluginStore {
  readonly flamePillars: IFlamePillarRepository
}
