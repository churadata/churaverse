import { Scene } from 'phaser'
import { SocketController } from '../adapter/controller/socket/socketController'
import { Interactor } from '../interactor/Interactor'
import { SocketEmitter } from '../interface/adapter/socketEmitter'
import { Socket } from '../interface/socket/socket'
import { PlayerRender } from '../interface/ui/Render/entity/playerRender'
import { KeyboardHelper } from '../interface/keyboard/keyboardHelper'
import { TextFieldObserver } from '../interface/ui/util/textFieldObserver'
import { DialogSwitcher } from '../interface/ui/Render/dialogSwitcher'
import { SettingDialog } from '../interface/ui/component/settingDialog/settingDialog'
import { PlayerColorButtons } from '../interface/ui/component/settingDialog/playerColorButtons'
import { RenameForm } from '../interface/ui/component/settingDialog/renameForm'
import { TextChatBoard } from '../interface/ui/component/textChat/textChatBoard'
import { TextChatInput } from '../interface/ui/component/textChat/textChatInput'
import { TextChatDialog } from '../interface/ui/component/textChat/textChatDialog'
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
import { KeyboardSetupInfoWriter } from '../interface/keyboardSetupInfo/keyboardSetupInfoWriter'
import { VoiceChatSender } from '../interface/voiceChat/voiceChatSender'
import { ScreenShareSender } from '../interface/screenShare/screenShareSender'
import { KeyboardSettingPopUpWindow } from '../interface/ui/component/keyboardSetting/keySettingPopUpWindow'
import { PlayerRenderFactory } from '../interface/ui/RenderFactory/playerRenderFactory'
import { BombRenderFactory } from '../interface/ui/RenderFactory/bombRenderFactory'
import { SharkRenderFactory } from '../interface/ui/RenderFactory/sharkRenderFactory'
import { ServerErrorRenderFactory } from '../interface/ui/RenderFactory/serverErrorRenderFactory'
import { KeyboardController } from '../adapter/controller/keyboard/keyboardController'
import { VoiceChatReceiver } from '../interface/voiceChat/voiceChatReceiver'
import { ScreenShareReceiver } from '../interface/screenShare/screenShareReceiver'
import { KeyConfiguration } from '../interface/keyboard/keyConfiguration'
import { PopUpKeySettingWindowButton } from '../interface/ui/component/keyboardSetting/popUpKeySettingWindowButton'
import { KeyboardSetupInfoReader } from '../interface/keyboardSetupInfo/keyboardSettingInfoReader'
import { DeathLogRender } from '../interface/ui/Render/entity/deathLogRender'
import { VoiceChatVolumeController } from '../interface/voiceChat/voiceChatVolumeController'
import { CameraVideoListRender } from '../interface/ui/component/camera/cameraVideoListRender'
import { CameraVideoSender } from '../interface/webCamera/cameraVideoSender'
import { CameraVideoReceiver } from '../interface/webCamera/cameraVideoReceiver'
import { PlayerList } from '../interface/ui/component/playerList/playerList'
import { PlayerListDialog } from '../interface/ui/component/playerList/playerListDialog'
import { ExitButton } from '../interface/ui/component/exit/exitButton'
import { MapRenderFactory } from '../interface/ui/RenderFactory/mapRenderFactory'
import { WorldConfig } from '../domain/model/worldConfig'
import { FadeOutLogRender } from '../interface/ui/Render/entity/fadeOutLogRender'
import { JoinLeaveLogRender } from '../interface/ui/Render/entity/joinLeaveLogRender'
import { TopBarIconContainer } from '../interface/ui/component/common/topBarIconContainer'
import { MegaphoneIcon } from '../interface/ui/component/voiceChat/megaphoneIcon'
import { SettingIcon } from '../interface/ui/component/settingDialog/settingIcon'
import { TextChatIcon } from '../interface/ui/component/textChat/textChatIcon'
import { Badge } from '../interface/ui/component/textChat/badge'
import { PlayerListIcon } from '../interface/ui/component/playerList/playerListIcon'
import { MicIcon } from '../interface/ui/component/voiceChat/micIcon'
import { ScreenShareIcon } from '../interface/ui/component/screenShare/screenShareIcon'
import { CameraIcon } from '../interface/ui/component/camera/cameraIcon'
import { AdminSettingDialog } from '../interface/ui/component/adminSettingDialog/adminSettingDialog'
import { InvincibleWorldModeSwitch } from '../interface/ui/component/adminSettingDialog/invincbleWorldModeSwitch'
import { AdminSettingIcon } from '../interface/ui/component/adminSettingDialog/adminSettingIcon'
import { SettingSection } from '../interface/ui/component/settingDialog/settingSection'
import { CallbackExecutionGuard } from '../adapter/controller/socket/callbackExecutionGuard'
import { MapSelector } from '../interface/ui/component/adminSettingDialog/mapSelector'
import { MapManager } from '../domain/service/mapManager'
import { SharedScreenRenderFactory } from '../interface/ui/RenderFactory/sharedScreenRenderFactory'
import { InvincibleIndicator } from '../interface/ui/component/invincibleMode/InvincibleIndicator'

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
    const worldConfig = new WorldConfig('Map1.json')
    const callbackExecutionGuard = new CallbackExecutionGuard(this)

    const socket = await Socket.build(callbackExecutionGuard)

    const cookieRepository = new CookieStore()
    const playerSetupInfoWriter = new PlayerSetupInfoWriter(cookieRepository)
    const keyboardSetupInfoWriter = new KeyboardSetupInfoWriter(cookieRepository)

    const keyboardSettingSetupInfoReader = new KeyboardSetupInfoReader(cookieRepository)
    const keyConfiguration = new KeyConfiguration(keyboardSettingSetupInfoReader)
    const keyboardHelper = new KeyboardHelper(this, keyConfiguration)

    const textFieldObserver = new TextFieldObserver()
    const chatDialog = await TextChatDialog.build(this, socket.socketId, textFieldObserver)
    const playerListDialog = await PlayerListDialog.build(this)
    const settingDialog = await SettingDialog.build(this)
    const adminSettingDialog = await AdminSettingDialog.build(this)
    const switcher = new DialogSwitcher()
    const playerRender = await PlayerRender.build(
      this,
      player.position,
      player.direction,
      player.name,
      player.color,
      player.hp
    )

    const sharedScreenRenderFactory = await new SharedScreenRenderFactory(this, worldConfig)

    const webRtc = new WebRtc(socket.socketId)
    const localDevice = new LocalDevice(
      await LkLocalMicrophoneManager.build(webRtc.room),
      await LkLocalSpeakerManager.build(webRtc.room),
      await LkLocalCameraManager.build(webRtc.room)
    )
    const voiceChatVolumeController = new VoiceChatVolumeController()
    const voiceChatSender = new VoiceChatSender(webRtc.room)
    const screenShareSender = new ScreenShareSender(this, webRtc.room, sharedScreenRenderFactory)
    const cameraVideoSender = new CameraVideoSender(this, webRtc.room)

    const texChatInput = await TextChatInput.build(this, socket.socketId, chatDialog, textFieldObserver)
    const textChatBoard = await TextChatBoard.build(this, socket.socketId, chatDialog)
    const keySettingPopUPWindow = await KeyboardSettingPopUpWindow.build(
      this,
      keyboardHelper,
      keyConfiguration.getKeyPreference(),
      textFieldObserver
    )
    const playerList = await PlayerList.build(this, playerListDialog)
    const renameForm = await RenameForm.build(this, socket.socketId, player.name, settingDialog, textFieldObserver)
    const playerColorButtons = await PlayerColorButtons.build(this, socket.socketId, player.color, settingDialog)
    const openKeySettingFormButton = await PopUpKeySettingWindowButton.build(this, settingDialog)
    const invincibleSwitch = await InvincibleWorldModeSwitch.build(this, socket.socketId, adminSettingDialog)
    settingDialog.addSection(new SettingSection('peripheralSetting', '接続機器設定'))
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
    const mapManager = new MapManager()
    const mapSwitch = await MapSelector.build(this, worldConfig, mapManager.maps, player, adminSettingDialog)

    const cameraVideoListRender = await CameraVideoListRender.build(this)

    const fadeOutLogRender = await FadeOutLogRender.build(this, 300)
    const deathLogRender = await DeathLogRender.build(this, fadeOutLogRender)
    const joinLeaveLogRender = await JoinLeaveLogRender.build(this, fadeOutLogRender)
    const exitButton = await ExitButton.build(this)
    const mapRenderFactory = new MapRenderFactory(this)

    const dialogIconContainer = new TopBarIconContainer()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const settingIcon = new SettingIcon(switcher, settingDialog, dialogIconContainer)
    const chatBadge = new Badge()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const chatIcon = new TextChatIcon(switcher, chatDialog, dialogIconContainer, chatBadge)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const playerListIcon = new PlayerListIcon(switcher, playerListDialog, dialogIconContainer)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const adminSettingIcon = new AdminSettingIcon(player.role, switcher, adminSettingDialog, dialogIconContainer)
    const screenShareIcon = new ScreenShareIcon(dialogIconContainer)
    const cameraIcon = new CameraIcon(dialogIconContainer)
    const micIcon = new MicIcon(dialogIconContainer)
    const megaphoneIcon = new MegaphoneIcon(socket.socketId, dialogIconContainer)
    const invincibleIndicator = new InvincibleIndicator(dialogIconContainer)

    const playerRenderFactory = new PlayerRenderFactory(this)
    const bombRenderFactory = new BombRenderFactory(this)
    const sharkRenderFactory = new SharkRenderFactory(this)
    const serverErrorRenderFactory = new ServerErrorRenderFactory(this)

    const emitter = new SocketEmitter(socket, this)
    const interactor = new Interactor(
      socket.socketId,
      emitter,
      mapSwitch,
      mapRenderFactory,
      textFieldObserver,
      textChatBoard,
      texChatInput,
      chatBadge,
      chatDialog,
      invincibleSwitch,
      localDevice,
      micSelector,
      speakerSelector,
      cameraSelector,
      cameraVideoListRender,
      cameraVideoSender,
      voiceChatSender,
      voiceChatVolumeController,
      screenShareSender,
      screenShareIcon,
      invincibleIndicator,
      playerSetupInfoWriter,
      keyboardSetupInfoWriter,
      keySettingPopUPWindow,
      keyConfiguration,
      deathLogRender,
      playerList,
      worldConfig,
      joinLeaveLogRender,
      fadeOutLogRender,
      player,
      playerRender,
      transitionManager,
      webRtc
    )

    this.keyboardController = new KeyboardController(
      interactor,
      socket.socketId,
      keyboardHelper,
      keyConfiguration,
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
    const screenShareReceiver = new ScreenShareReceiver(this, interactor, webRtc.room, sharedScreenRenderFactory)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const cameraVideoReceiver = new CameraVideoReceiver(this, interactor, webRtc.room)

    // interactorに渡す必要があるが, それ自身がinteractorを必要とするものはここでinteractorを渡す
    texChatInput.setInteractor(interactor)
    textChatBoard.setInteractor(interactor)
    playerColorButtons.setInteractor(interactor)
    renameForm.setInteractor(interactor)
    keySettingPopUPWindow.setInteractor(interactor)
    playerList.setInteractor(interactor)
    openKeySettingFormButton.setInteractor(interactor)
    invincibleSwitch.setInteractor(interactor)
    localDevice.setInteractor(interactor)
    micSelector.setInteractor(interactor)
    speakerSelector.setInteractor(interactor)
    cameraSelector.setInteractor(interactor)
    cameraVideoSender.setInteractor(interactor)
    screenShareSender.setInteractor(interactor)
    deathLogRender.setInteractor(interactor)
    exitButton.setInteractor(interactor)
    mapSwitch.setInteractor(interactor)

    screenShareIcon.setInteractor(interactor)
    cameraIcon.setInteractor(interactor)
    micIcon.setInteractor(interactor)
    megaphoneIcon.setInteractor(interactor)
    invincibleIndicator.setInteractor(interactor)

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
      interactor.saveKeyboardInfo()
    })
  }
}
