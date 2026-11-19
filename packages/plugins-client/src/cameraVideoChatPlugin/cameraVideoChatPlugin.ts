import type { DebugScreenPluginStore, DumpDebugDataEvent } from '@churaverse/debug-screen-plugin-client'
import { DebugDetailScreenSection } from '@churaverse/debug-screen-plugin-client'
import type { PlayerPluginStore } from '@churaverse/player-plugin-client'
import type { WebRtcPluginStore } from '@churaverse/web-rtc-plugin-client'
import { BasePlugin, type IMainScene } from 'churaverse-engine-client'
import { CameraEffectSettingStore } from './cameraEffectSettingStore'
import { CameraVideoSender } from './cameraVideoSender'
import type {
  IWebCameraIdDebugDetailScreen,
  IWebCameraMyStatusDebugDetailScreen,
} from './debugScreen/IDebugScreen/IWebCameraInfoDebugScreen'
import { WebCameraIdDebugDetailScreen } from './debugScreen/webCameraIdDebugDetailScreen'
import { WebCameraMyStatusDebugDetailScreen } from './debugScreen/webCameraMyStatusDebugDetailScreen'
import { EffectManager } from './effectManager'
import type { TriggerVideoSendingEvent } from './event/event'
import { EffectSettingUI } from './ui/effectSettingUi'
import { VideoChatUI } from './ui/videoChatUi'
import { VideoReceiver } from './videoReceiver'

export class CameraVideoChatPlugin extends BasePlugin<IMainScene> {
  private webRtcPluginStore!: WebRtcPluginStore
  private playerPluginStore!: PlayerPluginStore
  private debugScreenPluginStore!: DebugScreenPluginStore
  private cameraVideoSender!: CameraVideoSender
  private videoChatUI!: VideoChatUI
  private webCameraIdDebugDetailScreen!: IWebCameraIdDebugDetailScreen
  private webCameraMyStatusDebugDetailScreen!: IWebCameraMyStatusDebugDetailScreen
  private effectManager!: EffectManager
  private effectSettingStore!: CameraEffectSettingStore
  private cameraVideoReceiver!: VideoReceiver
  private effectSettingUI!: EffectSettingUI

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('triggerVideoSending', this.triggerVideoSending.bind(this))
    this.bus.subscribeEvent('dumpDebugData', this.dumpDebugData.bind(this))
    this.bus.subscribeEvent('videoChatStatusChanged', this.enableVideoChatButton.bind(this))
  }

  private triggerVideoSending(ev: TriggerVideoSendingEvent): void {
    this.cameraVideoSender.handleVideoSendTrigger(ev)
  }

  private init(): void {
    this.webRtcPluginStore = this.store.of('webRtcPlugin')
    this.videoChatUI = new VideoChatUI(this.store, this.bus)
    this.effectSettingStore = new CameraEffectSettingStore(this.bus, this.store)
    this.effectManager = new EffectManager(this.effectSettingStore)
    this.playerPluginStore = this.store.of('playerPlugin')
    this.debugScreenPluginStore = this.store.of('debugScreenPlugin')
    this.setupDebugScreen()
    this.cameraVideoSender = new CameraVideoSender(
      this.webRtcPluginStore.webRtc.room,
      this.store,
      this.bus,
      this.effectManager,
      this.webCameraIdDebugDetailScreen,
      this.webCameraMyStatusDebugDetailScreen
    )
    this.effectSettingUI = new EffectSettingUI(
      this.store,
      this.effectManager,
      this.cameraVideoSender,
      this.effectSettingStore
    )
    this.cameraVideoReceiver = new VideoReceiver(
      this.webRtcPluginStore.webRtc.room,
      this.store,
      this.webCameraIdDebugDetailScreen
    )
  }

  private setupDebugScreen(): void {
    const debugDetailScreenContainer = this.debugScreenPluginStore.debugDetailScreenContainer
    debugDetailScreenContainer.addSection(new DebugDetailScreenSection('webCameraInfo', 'WebCamera'))
    this.webCameraIdDebugDetailScreen = new WebCameraIdDebugDetailScreen(debugDetailScreenContainer)
    this.webCameraMyStatusDebugDetailScreen = new WebCameraMyStatusDebugDetailScreen(debugDetailScreenContainer)
  }

  private dumpDebugData(ev: DumpDebugDataEvent): void {
    const ownPlayerId = this.playerPluginStore.ownPlayerId
    const ownParticipant = this.webRtcPluginStore.webRtc.room.getParticipantByIdentity(ownPlayerId)
    const ownCameraStatus = ownParticipant !== undefined ? String(ownParticipant.isCameraEnabled) : 'undefined'
    ev.dataDumper.dump('webCameraIsOn', ownCameraStatus)

    const cameraEnabledIds: string[] = []
    for (const id of this.playerPluginStore.players.getAllId()) {
      const participant = this.webRtcPluginStore.webRtc.room.getParticipantByIdentity(id)
      if (participant === undefined) continue
      if (!participant.isCameraEnabled) continue
      cameraEnabledIds.push(id)
    }
    const idsText = cameraEnabledIds.length > 0 ? cameraEnabledIds.join(', ') : ''
    ev.dataDumper.dump('webCameraId', `${cameraEnabledIds.length}: ${idsText}`)
  }

  private enableVideoChatButton(): void {
    this.videoChatUI.videoChatIcon.enableButton()
  }
}
