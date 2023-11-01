import { IDialog } from '../../../../domain/IRender/IDialog'
import { DialogSwitcher } from '../../Render/dialogSwitcher'
import { TopBarIconRender } from '../common/topBarIcon'
import { TopBarIconContainer } from '../common/topBarIconContainer'

const PLAYER_LIST_ICON_PATH = 'assets/people.png'

export class PlayerListIcon extends TopBarIconRender {
  public constructor(private readonly switcher: DialogSwitcher, dialog: IDialog, iconContainer: TopBarIconContainer) {
    super({
      activeIconImgPath: PLAYER_LIST_ICON_PATH,
      inactiveIconImgPath: PLAYER_LIST_ICON_PATH,
      onClick: (isActive) => {
        this.onClick(isActive)
      },
      isActive: false,
    })

    iconContainer.addIcon(this)
    switcher.add('playerList', dialog, () => {
      super.deactivate()
    })
  }

  /** buttonが押されたときの動作 */
  private onClick(isActive: boolean): void {
    if (isActive) {
      this.switcher.close()
    } else {
      this.switcher.open('playerList', () => {
        super.activate()
      })
    }
  }
}
