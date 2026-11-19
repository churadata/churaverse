import type { ISharkRenderer } from './ISharkRenderer'
export interface ISharkRendererFactory {
  build: () => ISharkRenderer
}
