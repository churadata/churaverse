import type { IBlackHoleAttackRenderer } from './IBlackHoleAttackRenderer'

export interface IBlackHoleAttackRendererFactory {
  build: () => IBlackHoleAttackRenderer
}
