import type { IBlackHoleAttackRenderer } from '../domain/IBlackHoleAttackRenderer'
import type { IBlackHoleAttackRendererFactory } from '../domain/IBlackHoleAttackRendererFactory'
import type { BlackHoleRepository } from '../repository/blackHoleRepository'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    churarenBlackHolePlugin: BlackHolePluginStore
  }
}

export interface BlackHolePluginStore {
  readonly blackHoles: BlackHoleRepository
  readonly blackHoleAttackRenderers: Map<string, IBlackHoleAttackRenderer>
  readonly blackHoleAttackRendererFactory: IBlackHoleAttackRendererFactory
}
