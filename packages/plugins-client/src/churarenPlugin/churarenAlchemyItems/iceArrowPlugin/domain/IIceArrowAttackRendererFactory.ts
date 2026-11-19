import type { IIceArrowAttackRenderer } from './IIceArrowAttackRenderer'

export interface IIceArrowAttackRendererFactory {
  build: () => IIceArrowAttackRenderer
}
