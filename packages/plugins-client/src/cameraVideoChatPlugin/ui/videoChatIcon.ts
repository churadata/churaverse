import { type ITopBarIconContainer, TopBarIconRenderer } from '@churaverse/core-ui-plugin-client'
import type { IEventBus, IMainScene } from 'churaverse-engine-client'
import { TriggerVideoSendingEvent } from '../event/event'

import VIDEO_ON_ICON_PATH from './assets/video.png'
import VIDEO_OFF_ICON_PATH from './assets/video_off.png'

export class VideoChatIcon extends TopBarIconRenderer {
  private readonly iconDivContainer: HTMLDivElement
  private readonly _isEnabled = true

  public constructor(
    iconContainer: ITopBarIconContainer,
    private readonly bus: IEventBus<IMainScene>
  ) {
    super({
      activeIconImgPath: VIDEO_ON_ICON_PATH,
      inactiveIconImgPath: VIDEO_OFF_ICON_PATH,
      onClick: (isActive: boolean) => {
        this.onClick(isActive)
      },
      isActive: false,
      // mic icon の右に配置したい。mic icon の order は 200のためそれよりも小さい値として150を設定した。
      order: 150,
    })

    this.iconDivContainer = document.createElement('div')
    this.iconDivContainer.style.position = 'relative'
    this.iconDivContainer.appendChild(super.node)

    iconContainer.addIcon(this)
    super.deactivate()
  }

  public enableButton(): void {
    this.isEnabled = true
  }

  /** buttonが押されたときの動作 */
  private onClick(isActive: boolean): void {
    if (!this.isEnabled) return
    this.isEnabled = false

    if (isActive) {
      super.deactivate()
      this.bus.post(new TriggerVideoSendingEvent(!isActive))
    } else {
      super.activate()
      this.bus.post(new TriggerVideoSendingEvent(!isActive))
    }
  }

  private get isEnabled(): boolean {
    return this._isEnabled
  }

  private set isEnabled(isEnabled: boolean) {
    super.node.style.cursor = isEnabled ? 'default' : 'not-allowed'
  }
}
