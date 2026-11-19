import type { IAlchemyPotRenderer } from './IAlchemyPotRenderer'

export interface IAlchemyPotRendererFactory {
  build: () => IAlchemyPotRenderer
}
