import type { IPlayerListUi } from '../interface/IPlayerListUi'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    playerListPlugin: PlayerListPluginStore
  }
}

export interface PlayerListPluginStore {
  readonly playerListUi: IPlayerListUi
}
