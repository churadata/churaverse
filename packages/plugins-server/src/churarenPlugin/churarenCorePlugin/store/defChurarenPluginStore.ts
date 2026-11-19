import type { ChurarenGameSequence } from '../logic/churarenGameSequence'

export interface ChurarenPluginStore {
  churarenGameSequence: ChurarenGameSequence
}

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    churarenPlugin: ChurarenPluginStore
  }
}
