import { Scene } from 'phaser'
import { KeyboardController } from '../controller/keyboardController'
import { SocketController } from '../controller/socketController'
import { Interactor } from '../interactor/Interactor'
import { SocketEmitter } from '../interface/adapter/socketEmitter'
import { Socket } from '../interface/socket/socket'
import { MapRender } from '../ui/Render/mapRender'
import { PlayerRender } from '../ui/Render/playerRender'
import { KeyboardHelper } from '../interface/keyboard/keyboardHelper'
import { TextFieldObserver } from '../textFieldObserver'
import { DialogButtonsContainer } from '../ui/Render/dialogButtonsContainer'
import { DialogSwitcher } from '../ui/Render/dialogSwitcher'
import { SettingDialog } from '../ui/component/settingDialog'
import { PlayerColorButtons } from '../ui/component/playerColorButtons'
import { RenameForm } from '../ui/component/renameForm'
import { SettingButton } from '../ui/component/settingButton'
import { ChatButton } from '../ui/component/chatButton'
import { TextChatBoard } from '../ui/component/textChatBoard'
import { TextChatInput } from '../ui/component/textChatInput'
import { TextChatDialog } from '../ui/component/textChatDialog'
import { Badge } from '../ui/component/badge'
import { WebRtcChat } from '../ui/webRtcChat'
import { LocalDevice } from '../interface/localDeviceManager/localDevice'
import { LocalMicrophoneManager } from '../interface/localDeviceManager/localMicrophoneManager'
import { LocalCameraManager } from '../interface/localDeviceManager/localCameraManager'
import { MicSelector } from '../ui/component/micSelector'
import { WebRtc } from '../interface/localDeviceManager/webRtc'
import { CameraSelector } from '../ui/component/cameraSelector'
import { LocalSpeakerManager } from '../interface/localDeviceManager/localSpeakerManager'
import { SpeakerSelector } from '../ui/component/speakerSelector'
import { PlayerSetupInfoWriter } from '../interface/playerSetupInfo/playerSetupInfoWriter'
import { CookieStore } from '../interface/ repository/cookieStore'
import { IKeyboardController } from '../domain/IRender/IKeyboardController'
import { TransitionManager } from '../interface/transition/transitionManager'
import { TitleToMainData } from '../interactor/SceneTransitionData/titleToMain'

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

    const webRtc = new WebRtc()
    const localDevice = new LocalDevice(
      await LocalMicrophoneManager.build(webRtc.room),
      await LocalSpeakerManager.build(webRtc.room),
      await LocalCameraManager.build(webRtc.room)
    )

    const texChatInput = await TextChatInput.build(this, socket.socketId, chatDialog, textFieldObserver)
    const textChatBoard = await TextChatBoard.build(this, socket.socketId, chatDialog)
    const playerColorButtons = await PlayerColorButtons.build(this, socket.socketId, settingDialog)
    const renameForm = await RenameForm.build(this, socket.socketId, player.name, settingDialog, textFieldObserver)
    const micSelector = await MicSelector.build(
      this,
      localDevice.microphoneManager,
      settingDialog,
      await localDevice.microphoneManager.getMicrophones()
    )
    const speakerSelector = await SpeakerSelector.build(
      this,
      localDevice.speakerManager,
      settingDialog,
      await localDevice.speakerManager.getSpeakers()
    )
    const cameraSelector = await CameraSelector.build(
      this,
      localDevice.cameraManager,
      settingDialog,
      await localDevice.cameraManager.getCameras()
    )
    void ChatButton.build(this, switcher, chatDialog, dialogButtonsContainer, chatBadge)
    void SettingButton.build(this, switcher, settingDialog, dialogButtonsContainer)
    void WebRtcChat.build(this, webRtc.room)

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
      playerSetupInfoWriter,
      player,
      playerRender
    )
    const keyboardHelper = new KeyboardHelper(this)
    this.keyboardController = new KeyboardController(interactor, this, socket.socketId, keyboardHelper)
    this.socketController = new SocketController(interactor, socket, map.groundLayer, this)

    // interactorに渡す必要があるが, それ自身がinteractorを必要とするものはここでinteractorを渡す
    texChatInput.setInteractor(interactor)
    textChatBoard.setInteractor(interactor)
    playerColorButtons.setInteractor(interactor)
    renameForm.setInteractor(interactor)
    localDevice.setInteractor(interactor)
    micSelector.setInteractor(interactor)
    speakerSelector.setInteractor(interactor)
    cameraSelector.setInteractor(interactor)

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
