import { IDialog } from '../../../../domain/IRender/IDialog'
import { PlayerRoleName } from '../../../../domain/model/types'
import { DialogSwitcher } from '../../Render/dialogSwitcher'
import { TopBarIconRender } from '../common/topBarIcon'
import { TopBarIconContainer } from '../common/topBarIconContainer'

const ADMIN_SETTING_ICON_PATH = 'assets/adminSetting.png'

export class AdminSettingIcon extends TopBarIconRender {
  public constructor(
    playerRole: PlayerRoleName,
    private readonly switcher: DialogSwitcher,
    dialog: IDialog,
    iconContainer: TopBarIconContainer
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
