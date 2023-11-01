import { IDialog } from '../../../../domain/IRender/IDialog'
import { DialogSwitcher } from '../../Render/dialogSwitcher'
import { TopBarIconRender } from '../common/topBarIcon'
import { TopBarIconContainer } from '../common/topBarIconContainer'
import { Badge } from './badge'

const CHAT_ICON_PATH = 'assets/chat.png'

export class TextChatIcon extends TopBarIconRender {
  private readonly iconContainer: HTMLDivElement

  public constructor(
    private readonly switcher: DialogSwitcher,
    dialog: IDialog,
    iconContainer: TopBarIconContainer,
    private readonly chatBadge: Badge
  ) {
    super({
      activeIconImgPath: CHAT_ICON_PATH,
      inactiveIconImgPath: CHAT_ICON_PATH,
      onClick: (isActive) => {
        this.onClick(isActive)
      },
      isActive: false,
    })

    this.iconContainer = document.createElement('div')
    this.iconContainer.style.position = 'relative'
    this.iconContainer.appendChild(super.node)

    chatBadge.setBadgeOn(this.iconContainer)
    chatBadge.moveTo(0, 0)

    iconContainer.addIcon(this)
    switcher.add('chat', dialog, () => {
      super.deactivate()
    })
  }

  /** buttonが押されたときの動作 */
  private onClick(isActive: boolean): void {
    if (isActive) {
      this.switcher.close()
    } else {
      this.switcher.open('chat', () => {
        super.activate()
        this.chatBadge.deactivate()
      })
    }
  }

  public get node(): HTMLElement {
    return this.iconContainer
  }
}
