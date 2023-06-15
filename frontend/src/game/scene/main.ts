import { Scene } from 'phaser'
import { KeyboardController } from '../adapter/controller/keyboard/keyboardController'
import { SocketController } from '../adapter/controller/socket/socketController'
import { Interactor } from '../interactor/Interactor'
import { SocketEmitter } from '../interface/adapter/socketEmitter'
import { Socket } from '../interface/socket/socket'
import { MapRender } from '../interface/ui/Render/mapRender'
import { PlayerRender } from '../interface/ui/Render/entity/playerRender'
import { KeyboardHelper } from '../interface/keyboard/keyboardHelper'
import { TextFieldObserver } from '../interface/ui/util/textFieldObserver'
import { DialogButtonsContainer } from '../interface/ui/Render/dialogButtonsContainer'
import { DialogSwitcher } from '../interface/ui/Render/dialogSwitcher'
import { SettingDialog } from '../interface/ui/component/settingDialog/settingDialog'
import { PlayerColorButtons } from '../interface/ui/component/settingDialog/playerColorButtons'
import { RenameForm } from '../interface/ui/component/settingDialog/renameForm'
import { SettingButton } from '../interface/ui/component/settingDialog/settingButton'
import { ChatButton } from '../interface/ui/component/textChat/chatButton'
import { TextChatBoard } from '../interface/ui/component/textChat/textChatBoard'
import { TextChatInput } from '../interface/ui/component/textChat/textChatInput'
import { TextChatDialog } from '../interface/ui/component/textChat/textChatDialog'
import { Badge } from '../interface/ui/component/textChat/badge'
import { LocalDevice } from '../interface/localDeviceManager/localDevice'
import { LkLocalMicrophoneManager } from '../interface/localDeviceManager/liveKitAPI/lkLocalMicrophoneManager'
import { LkLocalCameraManager } from '../interface/localDeviceManager/liveKitAPI/lkLocalCameraManager'
import { MicSelector } from '../interface/ui/component/voiceChat/micSelector'
import { WebRtc } from '../interface/localDeviceManager/liveKitAPI/webRtc'
import { CameraSelector } from '../interface/ui/component/camera/cameraSelector'
import { LkLocalSpeakerManager } from '../interface/localDeviceManager/liveKitAPI/lkLocalSpeakerManager'
import { SpeakerSelector } from '../interface/ui/component/voiceChat/speakerSelector'
import { PlayerSetupInfoWriter } from '../interface/playerSetupInfo/playerSetupInfoWriter'
import { CookieStore } from '../interface/repository/cookieStore'
import { IKeyboardController } from '../domain/IRender/IKeyboardController'
import { TransitionManager } from '../interface/transition/transitionManager'
import { TitleToMainData } from '../interactor/sceneTransitionData/titleToMain'
import { VoiceChatReceiver } from '../interface/voiceChat/voiceChatReceiver'
import { VoiceChatSender } from '../interface/voiceChat/voiceChatSender'
import { MicButton } from '../interface/ui/component/voiceChat/micButton'
import { WebRtcButtonContainer } from '../interface/ui/Render/webRtcButtonContainer'
import { ScreenShareSender } from '../interface/screenShare/screenShareSender'
import { ScreenShareButton } from '../interface/ui/component/screenShare/screenShareButton'
import { ScreenShareReceiver } from '../interface/screenShare/screenShareReceiver'
import { CameraButton } from '../interface/ui/component/camera/cameraButton'
import { PlayerRenderFactory } from '../interface/ui/RenderFactory/playerRenderFactory'
import { BombRenderFactory } from '../interface/ui/RenderFactory/bombRenderFactory'
import { SharkRenderFactory } from '../interface/ui/RenderFactory/sharkRenderFactory'
import { ServerErrorRenderFactory } from '../interface/ui/RenderFactory/serverErrorRenderFactory'
import { DeathLogRender } from '../interface/ui/Render/entity/deathLogRender'
import { VoiceChatVolumeController } from '../interface/voiceChat/voiceChatVolumeController'
import { MegaphoneButton } from '../interface/ui/component/voiceChat/megaphoneButton'

/**
 * エントリーポイント
 * DIのみを担当
 *
 * phaserの機能により
 * init() → preload() → create() → update() → update()
 * と遷移する
 */
export class MainScene extends Scene {
  // controllerはupdateで使うため定義
  private keyboardController?: IKeyboardController
  private socketController?: SocketController

  public constructor() {
    super({
      key: 'Main',
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
    const transitionManager = new TransitionManager<TitleToMainData, undefined>(this.scene)
    const dataFromTitle = transitionManager.getReceivedData()
    const player = dataFromTitle.ownPlayer

    const map = await MapRender.build(this)
    const socket = await Socket.build()
    const chatDialog = await TextChatDialog.build(this)
    const chatBadge = await Badge.build(this)
    const settingDialog = await SettingDialog.build(this)
    const switcher = new DialogSwitcher()
    const dialogButtonsContainer = new DialogButtonsContainer(this)
    const textFieldObserver = new TextFieldObserver()
    const playerRender = await PlayerRender.build(
      this,
      map.groundLayer,
      player.position,
      player.direction,
      player.name,
      player.color
    )

    const webRtc = new WebRtc(socket.socketId)
    const localDevice = new LocalDevice(
      await LkLocalMicrophoneManager.build(webRtc.room),
      await LkLocalSpeakerManager.build(webRtc.room),
      await LkLocalCameraManager.build(webRtc.room)
    )
    const voiceChatVolumeController = new VoiceChatVolumeController()
    const voiceChatSender = new VoiceChatSender(webRtc.room)
    const screenShareSender = new ScreenShareSender(this, webRtc.room)

    const texChatInput = await TextChatInput.build(this, socket.socketId, chatDialog, textFieldObserver)
    const textChatBoard = await TextChatBoard.build(this, socket.socketId, chatDialog)
    const playerColorButtons = await PlayerColorButtons.build(this, socket.socketId, player.color, settingDialog)
    const renameForm = await RenameForm.build(this, socket.socketId, player.name, settingDialog, textFieldObserver)
    const micSelector = await MicSelector.build(
      this,
      localDevice.microphoneManager,
      settingDialog,
      await localDevice.microphoneManager.getDevices()
    )
    const speakerSelector = await SpeakerSelector.build(
      this,
      localDevice.speakerManager,
      settingDialog,
      await localDevice.speakerManager.getDevices()
    )
    const cameraSelector = await CameraSelector.build(
      this,
      localDevice.cameraManager,
      settingDialog,
      await localDevice.cameraManager.getDevices()
    )

    const webRtcButtonContainer = new WebRtcButtonContainer(this)
    const micButton = await MicButton.build(this, webRtcButtonContainer)
    const megaphoneButton = await MegaphoneButton.build(this, socket.socketId, webRtcButtonContainer)
    const cameraButton = await CameraButton.build(this, webRtcButtonContainer)
    const screenShareButton = await ScreenShareButton.build(this, webRtcButtonContainer)
    const deathLogRender = await DeathLogRender.build()
    void ChatButton.build(this, switcher, chatDialog, dialogButtonsContainer, chatBadge)
    void SettingButton.build(this, switcher, settingDialog, dialogButtonsContainer)

    const playerRenderFactory = new PlayerRenderFactory(this, map.groundLayer)
    const bombRenderFactory = new BombRenderFactory(this)
    const sharkRenderFactory = new SharkRenderFactory(this)
    const serverErrorRenderFactory = new ServerErrorRenderFactory(this)

    const cookieRepository = new CookieStore()
    const playerSetupInfoWriter = new PlayerSetupInfoWriter(cookieRepository)
    const emitter = new SocketEmitter(socket, this, map.groundLayer)
    const interactor = new Interactor(
      socket.socketId,
      emitter,
      map,
      textFieldObserver,
      textChatBoard,
      texChatInput,
      chatBadge,
      chatDialog,
      localDevice,
      micSelector,
      speakerSelector,
      cameraSelector,
      voiceChatSender,
      voiceChatVolumeController,
      screenShareSender,
      screenShareButton,
      playerSetupInfoWriter,
      deathLogRender,
      player,
      playerRender
    )
    const keyboardHelper = new KeyboardHelper(this)
    this.keyboardController = new KeyboardController(
      interactor,
      socket.socketId,
      keyboardHelper,
      bombRenderFactory,
      sharkRenderFactory
    )
    this.socketController = new SocketController(
      interactor,
      socket,
      playerRenderFactory,
      sharkRenderFactory,
      bombRenderFactory,
      serverErrorRenderFactory
    )

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const voiceChatReceiver = new VoiceChatReceiver(interactor, webRtc.room)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const screenShareReceiver = new ScreenShareReceiver(this, interactor, webRtc.room)

    // interactorに渡す必要があるが, それ自身がinteractorを必要とするものはここでinteractorを渡す
    texChatInput.setInteractor(interactor)
    textChatBoard.setInteractor(interactor)
    playerColorButtons.setInteractor(interactor)
    renameForm.setInteractor(interactor)
    localDevice.setInteractor(interactor)
    micSelector.setInteractor(interactor)
    speakerSelector.setInteractor(interactor)
    cameraSelector.setInteractor(interactor)
    micButton.setInteractor(interactor)
    megaphoneButton.setInteractor(interactor)
    cameraButton.setInteractor(interactor)
    screenShareButton.setInteractor(interactor)
    screenShareSender.setInteractor(interactor)
    deathLogRender.setInteractor(interactor)

    this.willGameEnd(interactor)
  }

  /**
   * game loop部分
   * force unwrap(!)するとエラーが出る可能性が考えられるため要注意
   * @param time 現在時間
   * @param delta 前回updateとの時間差(ms)
   */
  public update(time: number, delta: number): void {
    this.keyboardController?.update(time, delta)
    this.socketController?.update()
  }
  /**
   * ページを更新
   */

  public willGameEnd(interactor: Interactor): void {
    window.addEventListener('beforeunload', () => {
      interactor.savePlayerInfo()
    })
  }
}
