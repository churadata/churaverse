import type { PlayerRole } from '@churaverse/shared-types-client'
import ADMIN_SETTING_ICON_PATH from '../assets/adminSetting.png'
import type { IAdminSettingDialog } from '../interface/IAdminSettingDialog'
import type { IDialogSwitcher } from '../interface/IDialogSwitcher'
import type { ITopBarIconContainer } from '../interface/ITopBarIconContainer'
import { TopBarIconRenderer } from '../topBarIcon'

export class AdminSettingIcon extends TopBarIconRenderer {
  public constructor(
    playerRole: PlayerRole,
    private readonly switcher: IDialogSwitcher,
    dialog: IAdminSettingDialog,
    iconContainer: ITopBarIconContainer
  ) {
    super({
      activeIconImgPath: ADMIN_SETTING_ICON_PATH,
      inactiveIconImgPath: ADMIN_SETTING_ICON_PATH,
      onClick: (isActive) => {
        this.onClick(isActive)
      },
      isActive: false,
    })

    if (playerRole !== 'admin') {
      return
    }
    iconContainer.addIcon(this)
    switcher.add('adminSetting', dialog, () => {
      super.deactivate()
    })
  }

  /** buttonが押されたときの動作 */
  private onClick(isActive: boolean): void {
    if (isActive) {
      this.switcher.close()
    } else {
      this.switcher.open('adminSetting', () => {
        super.activate()
      })
    }
  }
}
