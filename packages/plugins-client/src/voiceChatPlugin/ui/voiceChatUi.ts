import type { IEventBus, IMainScene, Store } from 'churaverse-engine-client'
import type { IVoiceChatSender } from '../domain/IVoiceChatSender'
import { MegaphoneIcon } from './voiceChatIcon/megaphoneIcon'
import { MicIcon } from './voiceChatIcon/micIcon'

/**
 * 画面上部に並ぶアイコンにボイスチャット関連のアイコンを追加するクラス
 */
export class VoiceChatUi {
  public readonly micIcon: MicIcon
  public readonly megaphoneIcon: MegaphoneIcon

  public constructor(store: Store<IMainScene>, eventBus: IEventBus<IMainScene>, voiceChatSender: IVoiceChatSender) {
    const topBarIconContainer = store.of('coreUiPlugin').topBarIconContainer
    const playerPluginStore = store.of('playerPlugin')
    const ownPlayerId = playerPluginStore.ownPlayerId
    this.micIcon = new MicIcon(topBarIconContainer, voiceChatSender)
    this.megaphoneIcon = new MegaphoneIcon(eventBus, topBarIconContainer, ownPlayerId)
  }
}
