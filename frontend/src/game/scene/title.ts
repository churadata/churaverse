import { Scene } from 'phaser'
import { TitleToMainData } from '../interactor/SceneTransitionData/titleToMain'
import { TitleInteractor } from '../interactor/titleInteractor'
import { CookieStore } from '../interface/ repository/cookieStore'
import { PlayerSetupInfoReader } from '../interface/playerSetupInfo/playerSetupInfoReader'
import { TransitionManager } from '../interface/transition/transitionManager'
import { BackgroundRender } from '../ui/Render/component/backgroundRender'
import { JoinButtonRender } from '../ui/Render/component/joinButtonRender'
import { LocalDeviceRender } from '../ui/Render/component/localDeviceRender'
import { VersionRender } from '../ui/Render/component/versionRender'
import { LocalDevice } from '../interface/localDeviceManager/localDevice'
import { ILocalDevice } from '../interactor/ILocalDeviceManager/ILocalDevice'
import { LocalMicrophoneManager } from '../interface/localDeviceManager/localMicrophoneManager'
import { LocalCameraManager } from '../interface/localDeviceManager/localCameraManager'
import { WebRtc } from '../interface/localDeviceManager/webRtc'
import { LocalSpeakerManager } from '../interface/localDeviceManager/localSpeakerManager'
import { TitleNameFieldRender } from '../ui/Render/component/titleNameFieldRender'

/**
 * エントリーポイント
 * DIのみを担当
 *
 * phaserの機能により
 * init() → preload() → create() → update() → update()
 * と遷移する
 */
export class TitleScene extends Scene {
  public constructor() {
    super({
      key: 'Title',
      active: false,
    })
  }

  /**
   * アセットのロードやspriteの作成が可能なのはcreate以降なため,
   * createにてDIを行う
   */
  public create(): void {
    void this.inject()
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  private async inject(): Promise<void> {
    const transitionManager = new TransitionManager<undefined, TitleToMainData>(this.scene)
    const cookieRepository = new CookieStore()
    const playerSetupInfoReader = new PlayerSetupInfoReader(cookieRepository)

    const webRtc = new WebRtc()
    const localDevice: ILocalDevice = new LocalDevice(
      await LocalMicrophoneManager.build(webRtc.room),
      await LocalSpeakerManager.build(webRtc.room),
      await LocalCameraManager.build(webRtc.room)
    )

    void BackgroundRender.build(this)
    void LocalDeviceRender.build(this, localDevice)
    void VersionRender.build(this)
    const joinButton = await JoinButtonRender.build(this)
    const nameField = await TitleNameFieldRender.build(this, playerSetupInfoReader.read().name)

    const interactor = new TitleInteractor(transitionManager, nameField, playerSetupInfoReader)

    // interactorに渡す必要があるが, それ自身がinteractorを必要とするものはここでinteractorを渡す
    joinButton.setInteractor(interactor)
  }
}
