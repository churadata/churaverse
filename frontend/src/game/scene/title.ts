import { Scene } from 'phaser'
import { TitleToMainData } from '../interactor/sceneTransitionData/titleToMain'
import { TitleInteractor } from '../interactor/titleInteractor'
import { CookieStore } from '../interface/repository/cookieStore'
import { PlayerSetupInfoReader } from '../interface/playerSetupInfo/playerSetupInfoReader'
import { TransitionManager } from '../interface/transition/transitionManager'
import { BackgroundRender } from '../interface/ui/Render/title/backgroundRender'
import { JoinButtonRender } from '../interface/ui/Render/title/joinButtonRender'
import { LocalDeviceRender } from '../interface/ui/Render/title/localDeviceRender'
import { VersionRender } from '../interface/ui/Render/title/versionRender'
import { LocalDevice } from '../interface/localDeviceManager/localDevice'
import { ILocalDevice } from '../interactor/ILocalDeviceManager/ILocalDevice'
import { TitleNameFieldRender } from '../interface/ui/Render/title/titleNameFieldRender'
import { MdLocalMicrophoneManager } from '../interface/localDeviceManager/mediaDevicesAPI/mdLocalMicrophoneManager'
import { MdLocalSpeakerManager } from '../interface/localDeviceManager/mediaDevicesAPI/mdLocalSpeakerManager'
import { MdLocalCameraManager } from '../interface/localDeviceManager/mediaDevicesAPI/mdLocalCameraManager'

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

  private async inject(): Promise<void> {
    const transitionManager = new TransitionManager<undefined, TitleToMainData>(this.scene)
    const cookieRepository = new CookieStore()
    const playerSetupInfoReader = new PlayerSetupInfoReader(cookieRepository)

    const localDevice: ILocalDevice = new LocalDevice(
      await MdLocalMicrophoneManager.build(),
      await MdLocalSpeakerManager.build(),
      await MdLocalCameraManager.build()
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
