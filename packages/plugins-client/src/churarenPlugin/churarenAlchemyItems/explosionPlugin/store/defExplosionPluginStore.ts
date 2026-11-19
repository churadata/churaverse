import type { IExplosionAttackRenderer } from '../domain/IExplosionAttackRenderer'
import type { IExplosionAttackRendererFactory } from '../domain/IExplosionAttackRendererFactory'
import type { ExplosionRepository } from '../repository/explosionRepository'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    churarenExplosionPlugin: ExplosionPluginStore
  }
}

export interface ExplosionPluginStore {
  readonly explosions: ExplosionRepository
  readonly explosionAttackRenderers: Map<string, IExplosionAttackRenderer>
  readonly explosionAttackRendererFactory: IExplosionAttackRendererFactory
}
