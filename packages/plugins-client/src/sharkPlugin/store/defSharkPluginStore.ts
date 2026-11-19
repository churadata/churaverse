import type { ISharkRenderer } from '../domain/ISharkRenderer'
import type { ISharkRendererFactory } from '../domain/ISharkRendererFactory'
import type { SharkRepository } from '../repository/sharkRepository'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    sharkPlugin: SharkPluginStore
  }
}

export interface SharkPluginStore {
  readonly sharks: SharkRepository
  readonly sharkRenderers: Map<string, ISharkRenderer>
  readonly sharkRendererFactory: ISharkRendererFactory
}
