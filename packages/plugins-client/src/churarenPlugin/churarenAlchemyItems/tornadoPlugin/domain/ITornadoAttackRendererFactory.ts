import type { ITornadoAttackRenderer } from './ITornadoAttackRenderer'

export interface ITornadoAttackRendererFactory {
  build: () => ITornadoAttackRenderer
}
