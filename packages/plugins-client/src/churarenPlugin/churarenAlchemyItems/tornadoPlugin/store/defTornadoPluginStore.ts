import type { ITornadoAttackRenderer } from '../domain/ITornadoAttackRenderer'
import type { ITornadoAttackRendererFactory } from '../domain/ITornadoAttackRendererFactory'
import type { TornadoRepository } from '../repository/tornadoRepository'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    churarenTornadoPlugin: TornadoPluginStore
  }
}

export interface TornadoPluginStore {
  readonly tornados: TornadoRepository
  readonly tornadoAttackRenderers: Map<string, ITornadoAttackRenderer>
  readonly tornadoAttackRendererFactory: ITornadoAttackRendererFactory
}
