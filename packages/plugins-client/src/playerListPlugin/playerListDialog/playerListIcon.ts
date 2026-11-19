import {
  type IDialogSwitcher,
  type ITopBarIconContainer,
  type ITopBarIconRenderer,
  TopBarIconRenderer,
} from '@churaverse/core-ui-plugin-client'
import PLAYER_LIST_ICON_PATH from '../assets/people.png'
import type { IPlayerListDialog } from '../interface/IPlayerListDialog'

export class PlayerListIcon extends TopBarIconRenderer implements ITopBarIconRenderer {
  public constructor(
    private readonly switcher: IDialogSwitcher,
    dialog: IPlayerListDialog,
    iconContainer: ITopBarIconContainer
  ) {
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
