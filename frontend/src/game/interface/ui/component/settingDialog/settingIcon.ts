import { IDialog } from '../../../../domain/IRender/IDialog'
import { DialogSwitcher } from '../../Render/dialogSwitcher'
import { TopBarIconRender } from '../common/topBarIcon'
import { TopBarIconContainer } from '../common/topBarIconContainer'

const SETTING_ICON_PATH = 'assets/gear.png'

export class SettingIcon extends TopBarIconRender {
  public constructor(private readonly switcher: DialogSwitcher, dialog: IDialog, iconContainer: TopBarIconContainer) {
    super({
      activeIconImgPath: SETTING_ICON_PATH,
      inactiveIconImgPath: SETTING_ICON_PATH,
      onClick: (isActive) => {
        this.onClick(isActive)
      },
      isActive: false,
    })

    iconContainer.addIcon(this)
    switcher.add('setting', dialog, () => {
      super.deactivate()
    })
  }

  /** buttonが押されたときの動作 */
  private onClick(isActive: boolean): void {
    if (isActive) {
      this.switcher.close()
    } else {
      this.switcher.open('setting', () => {
        super.activate()
      })
    }
  }
}
