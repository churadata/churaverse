import type { GroundScreenRendererFactory } from '../renderer/groundScreenRendererFactory'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    groundScreenPlugin: GroundScreenPluginStore
  }
}
export interface GroundScreenPluginStore {
  readonly groundScreenRendererFactory: GroundScreenRendererFactory
}
