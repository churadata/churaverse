import type { IEventBus, IMainScene, Store } from 'churaverse-engine-client'
import type { IVideoChatIcon } from '../interface/IVideoChatIcon'
import type { IVideoChatUi } from '../interface/IVideoChatUI'
import { VideoChatIcon } from './videoChatIcon'

export class VideoChatUI implements IVideoChatUi {
  public readonly videoChatIcon: IVideoChatIcon

  public constructor(store: Store<IMainScene>, eventBus: IEventBus<IMainScene>) {
    const coreUiPluginStore = store.of('coreUiPlugin')

    this.videoChatIcon = new VideoChatIcon(coreUiPluginStore.topBarIconContainer, eventBus)
  }
}
