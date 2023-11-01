import { Interactor } from '../../../../interactor/Interactor'
import { TopBarIconRender } from '../common/topBarIcon'
import { TopBarIconContainer } from '../common/topBarIconContainer'

const CAMERA_ACTIVE_ICON_PATH = 'assets/video.png'
const CAMERA_INACTIVE_ICON_PATH = 'assets/video_off.png'

export class CameraIcon extends TopBarIconRender {
  private interactor?: Interactor

  public constructor(iconContainer: TopBarIconContainer) {
    super({
      activeIconImgPath: CAMERA_ACTIVE_ICON_PATH,
      inactiveIconImgPath: CAMERA_INACTIVE_ICON_PATH,
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
      void this.tryStopCameraVideo()
    } else {
      void this.tryStartCameraVideo()
    }
  }

  /**
   * Webカメラを開始する
   * 開始できなかった場合はbuttonを非有効化
   */
  private async tryStartCameraVideo(): Promise<void> {
    const isStartSuccessful = await this.interactor?.startCameraVideo()
    if (isStartSuccessful ?? false) {
      super.activate()
    } else {
      super.deactivate()
    }
  }

  /**
   * Webカメラを停止する
   * 停止できなかった場合はbuttonを有効化
   */
  private async tryStopCameraVideo(): Promise<void> {
    const isStopSuccessful = await this.interactor?.stopCameraVideo()
    if (isStopSuccessful ?? false) {
      super.deactivate()
    } else {
      super.activate()
    }
  }
}
