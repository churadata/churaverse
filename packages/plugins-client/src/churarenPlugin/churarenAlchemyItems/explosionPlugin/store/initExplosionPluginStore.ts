import type { IMainScene, Store } from 'churaverse-engine-client'
import type { IExplosionAttackRenderer } from '../domain/IExplosionAttackRenderer'
import type { IExplosionAttackRendererFactory } from '../domain/IExplosionAttackRendererFactory'
import { ExplosionRepository } from '../repository/explosionRepository'
import type { ExplosionPluginStore } from './defExplosionPluginStore'

export function initExplosionPluginStore(
  store: Store<IMainScene>,
  attackRendererFactory: IExplosionAttackRendererFactory | undefined
): void {
  if (attackRendererFactory === undefined) throw Error('attackRendererFactory is undefined')

  const explosionPluginStore: ExplosionPluginStore = {
    explosions: new ExplosionRepository(),
    explosionAttackRenderers: new Map<string, IExplosionAttackRenderer>(),
    explosionAttackRendererFactory: attackRendererFactory,
  }

  store.setInit('churarenExplosionPlugin', explosionPluginStore)
}

export function resetExplosionPluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('churarenExplosionPlugin')
}
