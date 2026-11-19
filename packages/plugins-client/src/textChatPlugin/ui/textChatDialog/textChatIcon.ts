import { type IDialogSwitcher, type ITopBarIconContainer, TopBarIconRenderer } from '@churaverse/core-ui-plugin-client'
import CHAT_ICON_PATH from '../../assets/chat.png'
import type { ITextChatDialog } from '../interface/ITextChatDialog'
import type { Badge } from './badge'

export class TextChatIcon extends TopBarIconRenderer {
  private readonly iconContainer: HTMLDivElement

  public constructor(
    private readonly switcher: IDialogSwitcher,
    dialog: ITextChatDialog,
    iconContainer: ITopBarIconContainer,
    public readonly badge: Badge,
    private readonly onOpenChat: () => void,
    private readonly onCloseChat: () => void,
    iconPath: string = CHAT_ICON_PATH
  ) {
    super({
      activeIconImgPath: iconPath,
      inactiveIconImgPath: iconPath,
      onClick: (isActive) => {
        this.onClick(isActive)
      },
      isActive: false,
    })

    this.iconContainer = document.createElement('div')
    this.iconContainer.style.position = 'relative'
    this.iconContainer.appendChild(super.node)

    badge.setBadgeOn(this.iconContainer)
    badge.moveTo(0, 0)

    iconContainer.addIcon(this)
    switcher.add('chat', dialog, () => {
      super.deactivate()
      this.onCloseChat()
    })
  }

  /** buttonが押されたときの動作 */
  private onClick(isActive: boolean): void {
    if (isActive) {
      this.switcher.close()
    } else {
      this.onOpenChat()
    }
  }

  public get node(): HTMLElement {
    return this.iconContainer
  }
}
