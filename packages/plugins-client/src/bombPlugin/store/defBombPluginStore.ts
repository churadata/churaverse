import type { IBombRenderer } from '../domain/IBombRenderer'
import type { IBombRendererFactory } from '../domain/IBombRendererFactory'
import type { BombRepository } from '../repository/bombRepository'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    bombPlugin: BombPluginStore
  }
}

export interface BombPluginStore {
  readonly bombs: BombRepository
  readonly bombRenderers: Map<string, IBombRenderer>
  readonly bombRendererFactory: IBombRendererFactory
}
