import type { IIceArrowAttackRenderer } from '../domain/IIceArrowAttackRenderer'
import type { IIceArrowAttackRendererFactory } from '../domain/IIceArrowAttackRendererFactory'
import type { IceArrowRepository } from '../repository/iceArrowRepository'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    churarenIceArrowPlugin: IceArrowPluginStore
  }
}

export interface IceArrowPluginStore {
  readonly iceArrows: IceArrowRepository
  readonly iceArrowAttackRenderers: Map<string, IIceArrowAttackRenderer>
  readonly iceArrowAttackRendererFactory: IIceArrowAttackRendererFactory
}
