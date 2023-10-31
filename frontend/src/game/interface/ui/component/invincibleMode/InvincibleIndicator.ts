import { Interactor } from '../../../../interactor/Interactor'
import { TopBarIconRender } from '../common/topBarIcon'
import { TopBarIconContainer } from '../common/topBarIconContainer'

const CAMERA_ACTIVE_ICON_PATH = 'assets/invincibleIndicator.png'

export class InvincibleIndicator extends TopBarIconRender {
  private interactor?: Interactor

  public constructor(iconContainer: TopBarIconContainer) {
    super({
      activeIconImgPath: CAMERA_ACTIVE_ICON_PATH,
      inactiveIconImgPath: '',
      onClick: (isActive) => {},
      isActive: true,
    })

    iconContainer.addIcon(this)
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }

  /**
   * アイコンの画像をactiveIconImgPathにして不透明にする
   * @override
   */
  public activate(): void {
    super.activate()
    this.imgElement.style.display = 'inline'
  }

  /**
   * アイコンの画像をinactiveIconImgPathにして半透明にする
   * @override
   */
  public deactivate(): void {
    super.deactivate()
    this.imgElement.style.display = 'none'
  }
}
