import type { IPlayerRenderer, Player } from '@churaverse/player-plugin-client'
import type { ITitleScene, Store } from 'churaverse-engine-client'
import type { ITitleNameFieldRenderer } from '../domain/ITitleNameFieldRenderer'
import type { ITitlePlayerRoleRenderer } from '../domain/ITitlePlayerRoleRenderer'
import type { TitlePlayerPluginStore } from './defTitlePlayerPlugin'

export function initTitlePlayerPluginStore(
  store: Store<ITitleScene>,
  ownPlayer: Player,
  preveiwPlayer: IPlayerRenderer,
  titleNameFieldRenderer: ITitleNameFieldRenderer,
  titlePlayerRoleRenderer: ITitlePlayerRoleRenderer
): void {
  const titlePlayerPluginStore: TitlePlayerPluginStore = {
    ownPlayer: ownPlayer,
    previewPlayer: preveiwPlayer,
    titleNameFieldRenderer: titleNameFieldRenderer,
    titlePlayerRoleRenderer: titlePlayerRoleRenderer,
  }
  store.setInit('titlePlayerPlugin', titlePlayerPluginStore)
}
