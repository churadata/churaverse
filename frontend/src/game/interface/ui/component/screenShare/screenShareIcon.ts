import { Interactor } from '../../../../interactor/Interactor'
import { TopBarIconRender } from '../common/topBarIcon'
import { TopBarIconContainer } from '../common/topBarIconContainer'

const SCREEN_SHARE_ACTIVE_ICON_PATH = 'assets/screenshare.png'
const SCREEN_SHARE_INACTIVE_ICON_PATH = 'assets/screenshare_off.png'

export class ScreenShareIcon extends TopBarIconRender {
  private interactor?: Interactor

  public constructor(iconContainer: TopBarIconContainer) {
    super({
      activeIconImgPath: SCREEN_SHARE_ACTIVE_ICON_PATH,
      inactiveIconImgPath: SCREEN_SHARE_INACTIVE_ICON_PATH,
      onClick: (isActive) => {
        this.onClick(isActive)
      },
      isActive: false,
    })

    iconContainer.addIcon(this)
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }

  /** buttonが押されたときの動作 */
  private onClick(isActive: boolean): void {
    if (isActive) {
      void this.tryStopScreenShare()
    } else {
      void this.tryStartScreenShare()
    }
  }

  /**
   * 画面共有を開始する
   * 開始できなかった場合はbuttonを非有効化
   */
  private async tryStartScreenShare(): Promise<void> {
    const isStartSuccessful = await this.interactor?.startScreenShare()
    if (isStartSuccessful ?? false) {
      super.activate()
    } else {
      super.deactivate()
    }
  }

  /**
   * 画面共有を停止する
   * 停止できなかった場合はbuttonを有効化
   */
  private async tryStopScreenShare(): Promise<void> {
    const isStopSuccessful = await this.interactor?.stopScreenShare()
    if (isStopSuccessful ?? false) {
      super.deactivate()
    } else {
      super.activate()
    }
  }
}
