import type { IExplosionRepository } from '../domain/IExplosionRepository'

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    explosionPlugin: ExplosionPluginStore
  }
}

export interface ExplosionPluginStore {
  readonly explosions: IExplosionRepository
}
