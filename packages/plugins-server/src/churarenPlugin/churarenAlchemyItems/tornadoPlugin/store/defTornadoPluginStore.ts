import type { ITornadoRepository } from '../domain/ITornadoRepository'

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    tornadoPlugin: TornadoPluginStore
  }
}

export interface TornadoPluginStore {
  readonly tornados: ITornadoRepository
}
