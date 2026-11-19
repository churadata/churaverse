import type { IExplosionAttackRenderer } from './IExplosionAttackRenderer'

export interface IExplosionAttackRendererFactory {
  build: () => IExplosionAttackRenderer
}
