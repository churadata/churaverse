import type { IPlayerRenderer, Player } from '@churaverse/player-plugin-client'
import type { ITitleNameFieldRenderer } from '../domain/ITitleNameFieldRenderer'
import type { ITitlePlayerRoleRenderer } from '../domain/ITitlePlayerRoleRenderer'

declare module 'churaverse-engine-client' {
  export interface StoreInTitle {
    titlePlayerPlugin: TitlePlayerPluginStore
  }
}

export interface TitlePlayerPluginStore {
  readonly ownPlayer: Player
  readonly previewPlayer: IPlayerRenderer
  readonly titleNameFieldRenderer: ITitleNameFieldRenderer
  readonly titlePlayerRoleRenderer: ITitlePlayerRoleRenderer
}
