import { Interactor } from '../../../../interactor/Interactor'
import { TopBarIconRender } from '../common/topBarIcon'
import { TopBarIconContainer } from '../common/topBarIconContainer'

export const MEGAPHONE_ICON_PATH = 'assets/megaphone.png'

export class MegaphoneIcon extends TopBarIconRender {
  private interactor?: Interactor

  public constructor(private readonly playerId: string, iconContainer: TopBarIconContainer) {
    super({
      activeIconImgPath: MEGAPHONE_ICON_PATH,
      inactiveIconImgPath: MEGAPHONE_ICON_PATH,
      onClick: (isActive) => {
        this.onClick(isActive)
      },
      isActive: true,
    })

    iconContainer.addIcon(this)
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }

  /** buttonが押されたときの動作 */
  private onClick(isActive: boolean): void {
    if (isActive) {
      this.deactivateMegaphone()
    } else {
      this.activateMegaphone()
    }
  }

  private activateMegaphone(): void {
    this.interactor?.toggleMegaphone(this.playerId, true)
    super.activate()
  }

  private deactivateMegaphone(): void {
    this.interactor?.toggleMegaphone(this.playerId, false)
    super.deactivate()
  }
}
