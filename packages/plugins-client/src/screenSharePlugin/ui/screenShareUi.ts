import type { IMainScene, Store } from 'churaverse-engine-client'
import type { IScreenShareSender } from '../interface/IScreenShareSender'
import { ScreenShareFooterComponent } from './screenShareFooter/components/ScreenShareFooterComponent'
import { ScreenShareIcon } from './screenShareIcon/screenShareIcon'

export class ScreenShareUi {
  public readonly screenShareIcon: ScreenShareIcon
  public readonly screenShareFooter: ScreenShareFooterComponent

  public constructor(store: Store<IMainScene>, screenShareSender: IScreenShareSender) {
    const uiStore = store.of('coreUiPlugin')
    this.screenShareIcon = new ScreenShareIcon(uiStore.topBarIconContainer, screenShareSender)
    this.screenShareFooter = new ScreenShareFooterComponent()
  }
}
