import type { IBombRenderer } from './IBombRenderer'

export interface IBombRendererFactory {
  build: () => IBombRenderer
}
