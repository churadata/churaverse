import { Interactor } from '../../../../interactor/Interactor'
import { TopBarIconRender } from '../common/topBarIcon'
import { TopBarIconContainer } from '../common/topBarIconContainer'

export const MIC_ACTIVE_ICON_PATH = 'assets/microphone.png'
export const MIC_INACTIVE_ICON_PATH = 'assets/microphone_off.png'

export class MicIcon extends TopBarIconRender {
  private interactor?: Interactor

  public constructor(iconContainer: TopBarIconContainer) {
    super({
      activeIconImgPath: MIC_ACTIVE_ICON_PATH,
      inactiveIconImgPath: MIC_INACTIVE_ICON_PATH,
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
      void this.tryStopVoiceStream()
    } else {
      void this.tryStartVoiceStream()
    }
  }

  /**
   * ボイスチャットを開始する
   * 開始できなかった場合はbuttonを非有効化
   */
  private async tryStartVoiceStream(): Promise<void> {
    const isStartSuccessful = await this.interactor?.startVoiceStream()
    if (isStartSuccessful ?? false) {
      super.activate()
    } else {
      super.deactivate()
    }
  }

  /**
   * ボイスチャットを停止する
   * 停止できなかった場合はbuttonを有効化
   */
  private async tryStopVoiceStream(): Promise<void> {
    const isStopSuccessful = await this.interactor?.stopVoiceStream()
    if (isStopSuccessful ?? false) {
      super.deactivate()
    } else {
      super.activate()
    }
  }
}
