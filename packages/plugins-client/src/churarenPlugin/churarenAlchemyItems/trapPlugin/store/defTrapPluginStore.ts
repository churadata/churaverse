import type { ITrapAttackRenderer } from '../domain/ITrapAttackRenderer'
import type { ITrapAttackRendererFactory } from '../domain/ITrapAttackRendererFactory'
import type { TrapRepository } from '../repository/trapRepository'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    churarenTrapPlugin: TrapPluginStore
  }
}

export interface TrapPluginStore {
  readonly traps: TrapRepository
  readonly trapAttackRenderers: Map<string, ITrapAttackRenderer>
  readonly trapAttackRendererFactory: ITrapAttackRendererFactory
}
