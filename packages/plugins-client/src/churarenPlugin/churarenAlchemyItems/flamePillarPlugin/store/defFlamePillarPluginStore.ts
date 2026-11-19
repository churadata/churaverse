import type { IFlamePillarAttackRenderer } from '../domain/IFlamePillarAttackRenderer'
import type { IFlamePillarAttackRendererFactory } from '../domain/IFlamePillarAttackRendererFactory'
import type { FlamePillarRepository } from '../repository/flamePillarRepository'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    churarenFlamePillarPlugin: FlamePillarPluginStore
  }
}

export interface FlamePillarPluginStore {
  readonly flamePillars: FlamePillarRepository
  readonly flamePillarAttackRenderers: Map<string, IFlamePillarAttackRenderer>
  readonly flamePillarAttackRendererFactory: IFlamePillarAttackRendererFactory
}
