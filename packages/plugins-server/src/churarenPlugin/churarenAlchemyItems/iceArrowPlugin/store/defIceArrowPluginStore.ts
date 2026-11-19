import type { IIceArrowRepository } from '../domain/IIceArrowRepository'

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    iceArrowPlugin: IceArrowPluginStore
  }
}

export interface IceArrowPluginStore {
  readonly iceArrows: IIceArrowRepository
}
