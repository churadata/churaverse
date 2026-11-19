import type { DebugScreenPluginStore, DumpDebugDataEvent } from '@churaverse/debug-screen-plugin-client'
import { DebugDetailScreenSection } from '@churaverse/debug-screen-plugin-client'
import type { NetworkPluginStore } from '@churaverse/network-plugin-client'
import type { PlayerPluginStore } from '@churaverse/player-plugin-client'
import { isPlayer } from '@churaverse/player-plugin-client'
import type { WebRtcPluginStore } from '@churaverse/web-rtc-plugin-client'
import {
  BasePlugin,
  type EntitySpawnEvent,
  type IMainScene,
  type PhaserLoadAssets,
  type PhaserSceneInit,
} from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import { SocketController } from './controller/socketController'
import type {
  IMegaphoneMyStatusDebugDetailScreen,
  IMicrophoneMyStatusDebugDetailScreen,
} from './debugScreen/IDebugScreen/IVoiceChatInfoDebugDetailScreen'
import { MegaphoneMyStatusDebugDetailScreen } from './debugScreen/megaphoneMyStatusDebugDetailScreen'
import { MicrophoneMyStatusDebugDetailScreen } from './debugScreen/microphoneMyStatusDebugDetailScreen'
import type { IAudioService } from './domain/IAudioService'
import type { IVoiceChatSender } from './domain/IVoiceChatSender'
import type { MuteEvent } from './event/muteEvent'
import { ToggleMegaphoneEvent } from './event/toggleMegaphoneEvent'
import type { UnmuteEvent } from './event/unmuteEvent'
import { ToggleMegaphoneMessage } from './message/toggleMegaphoneMessage'
import { AudioPipelineService } from './service/audioPipelineService'
import type { VoiceChatPluginStore } from './store/defVoiceChatPluginStore'
import { initVoiceChatPluginStore } from './store/initVoiceChatPluginStore'
import { PlayerVoiceChatIcons } from './ui/playerVoiceChatIcons'
import { PlayerMegaphoneIcon } from './ui/voiceChatIcon/playerMegaphoneIcon'
import { PlayerMicIcon } from './ui/voiceChatIcon/playerMicIcon'
import { VoiceChatUi } from './ui/voiceChatUi'
import { VoiceChatReceiver } from './voiceChatReceiver'
import { VoiceChatSender } from './voiceChatSender'
import { VoiceChatVolumeController } from './voiceChatVolumeController'

export class VoiceChatPlugin extends BasePlugin<IMainScene> {
  private voiceChatPluginStore!: VoiceChatPluginStore
  private webRtcPluginStore!: WebRtcPluginStore
  private playerPluginStore!: PlayerPluginStore
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private debugScreenPluginStore!: DebugScreenPluginStore
  private voiceChatSender?: IVoiceChatSender
  private voiceChatUi?: VoiceChatUi
  private voiceChatVolumeController?: VoiceChatVolumeController
  private audioService?: IAudioService
  private scene?: Scene
  private microphoneMyStatusDebugDetailScreen!: IMicrophoneMyStatusDebugDetailScreen
  private megaphoneMyStatusDebugDetailScreen!: IMegaphoneMyStatusDebugDetailScreen
  private volumeUpdateTimer?: ReturnType<typeof setInterval>

  public listenEvent(): void {
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('start', this.startVoiceChatVolumeControl.bind(this))
    this.bus.subscribeEvent('phaserLoadAssets', this.loadAssets.bind(this))

    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
    this.bus.subscribeEvent('registerMessageListener', socketController.registerMessageListener.bind(socketController))

    this.bus.subscribeEvent('entitySpawn', this.onJoinPlayer.bind(this))
    this.bus.subscribeEvent('mute', this.onMute.bind(this))
    this.bus.subscribeEvent('unmute', this.onUnmute.bind(this))
    this.bus.subscribeEvent('toggleMegaphone', this.toggleMegaphone.bind(this))
    this.bus.subscribeEvent('dumpDebugData', this.dumpDebugData.bind(this))
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.scene = ev.scene
  }

  private init(): void {
    initVoiceChatPluginStore(this.store)
    this.getStores()
    this.audioService = new AudioPipelineService(this.webRtcPluginStore.webRtc.room)

    void new VoiceChatReceiver(
      this.webRtcPluginStore.webRtc.room,
      this.audioService,
      this.bus,
      this.voiceChatPluginStore.playerVoiceChatUis
    )
    this.voiceChatSender = new VoiceChatSender(
      this.webRtcPluginStore.webRtc.room,
      this.bus,
      this.store,
      this.playerPluginStore.ownPlayerId,
      this.audioService
    )
    this.voiceChatUi = new VoiceChatUi(this.store, this.bus, this.voiceChatSender)
    this.voiceChatVolumeController = new VoiceChatVolumeController(this.audioService)
    this.setupDebugScreen()
  }

  private getStores(): void {
    this.voiceChatPluginStore = this.store.of('voiceChatPlugin')
    this.webRtcPluginStore = this.store.of('webRtcPlugin')
    this.playerPluginStore = this.store.of('playerPlugin')
    this.networkPluginStore = this.store.of('networkPlugin')
    this.debugScreenPluginStore = this.store.of('debugScreenPlugin')
  }

  /**
   * ボイスチャットの音量を距離に応じて調整する
   */
  private startVoiceChatVolumeControl(): void {
    const ownPlayerId = this.playerPluginStore.ownPlayerId
    const players = this.playerPluginStore.players
    const ownPlayer = players.get(ownPlayerId)
    if (ownPlayer === undefined) return

    // 300ms毎に更新
    if (this.volumeUpdateTimer !== undefined) {
      clearInterval(this.volumeUpdateTimer)
    }

    this.volumeUpdateTimer = setInterval(() => {
      this.voiceChatVolumeController?.updateAccordingToDistance(ownPlayerId, players)
    }, 300)

    // LiveKit/ブラウザの自動再生制限で再生が止まるのを防ぐため、可能な限り早く復帰を試みる
    void this.audioService?.unlock()
  }

  // プラグイン停止やルーム離脱時に明示的に呼び出す想定のクリーンアップ
  public async disposeAudio(): Promise<void> {
    if (this.volumeUpdateTimer !== undefined) {
      clearInterval(this.volumeUpdateTimer)
      this.volumeUpdateTimer = undefined
    }
    await this.audioService?.dispose()
  }

  private setupDebugScreen(): void {
    const debugDetailScreenContainer = this.debugScreenPluginStore.debugDetailScreenContainer
    debugDetailScreenContainer.addSection(new DebugDetailScreenSection('voiceChatInfo', 'VoiceChat'))
    this.microphoneMyStatusDebugDetailScreen = new MicrophoneMyStatusDebugDetailScreen(debugDetailScreenContainer)
    this.megaphoneMyStatusDebugDetailScreen = new MegaphoneMyStatusDebugDetailScreen(debugDetailScreenContainer)
  }

  private loadAssets(ev: PhaserLoadAssets): void {
    PlayerMicIcon.loadAssets(ev.scene)
    PlayerMegaphoneIcon.loadAssets(ev.scene)
  }

  private onJoinPlayer(ev: EntitySpawnEvent): void {
    // Check if ev.entity is capable of being a Player
    if (!isPlayer(ev.entity)) return
    const playerId = ev.entity.id
    this.bus.post(new ToggleMegaphoneEvent(playerId, true))
    this.voiceChatVolumeController?.activateMegaphone(playerId)
    if (this.scene === undefined) return
    const playerVoiceChatUi = new PlayerVoiceChatIcons(this.scene, this.store, ev.entity.id)
    this.voiceChatPluginStore.playerVoiceChatUis.set(playerId, playerVoiceChatUi)
  }

  private onMute(ev: MuteEvent): void {
    const playerMicIcon = this.voiceChatPluginStore.playerVoiceChatUis.get(ev.playerId)?.playerMicIcon
    playerMicIcon?.handleMicIcons(false)
    const ownPlayerId = this.playerPluginStore.ownPlayerId
    if (ev.playerId !== ownPlayerId) return
    this.microphoneMyStatusDebugDetailScreen.update(false)
  }

  private onUnmute(ev: UnmuteEvent): void {
    const playerMicIcon = this.voiceChatPluginStore.playerVoiceChatUis.get(ev.playerId)?.playerMicIcon
    playerMicIcon?.handleMicIcons(true)
    const ownPlayerId = this.playerPluginStore.ownPlayerId
    if (ev.playerId !== ownPlayerId) return
    this.microphoneMyStatusDebugDetailScreen.update(true)
  }

  /**
   * メガホン機能のON/OFFを切り替える
   * @param playerId メガホン機能をトグルするプレイヤー
   * @param active trueの時メガホン機能をON
   */
  private toggleMegaphone(ev: ToggleMegaphoneEvent): void {
    // プレイヤー周りのメガホンアイコン切り替え
    const playerMegaphoneIcon = this.voiceChatPluginStore.playerVoiceChatUis.get(ev.playerId)?.playerMegaphoneIcon
    playerMegaphoneIcon?.handleMegaphone(ev.active)

    if (ev.active) {
      this.voiceChatVolumeController?.activateMegaphone(ev.playerId)
    } else {
      this.voiceChatVolumeController?.deactivateMegaphone(ev.playerId)
    }

    // 自プレイヤーが切り替えた場合は他プレイヤーに通知するだけ
    const ownPlayerId = this.playerPluginStore.ownPlayerId
    if (ev.playerId === ownPlayerId) {
      this.megaphoneMyStatusDebugDetailScreen.update(ev.active)
      this.networkPluginStore.messageSender.send(
        new ToggleMegaphoneMessage({ playerId: this.playerPluginStore.ownPlayerId, active: ev.active })
      )
    }
  }

  private dumpDebugData(ev: DumpDebugDataEvent): void {
    const ownPlayerId = this.playerPluginStore.ownPlayerId
    const ownParticipant = this.webRtcPluginStore.webRtc.room.getParticipantByIdentity(ownPlayerId)
    const ownMicrophoneStatus = ownParticipant !== undefined ? String(ownParticipant.isMicrophoneEnabled) : 'undefined'
    ev.dataDumper.dump('microphoneIsOn', ownMicrophoneStatus)

    const isActiveMegaphone = this.voiceChatVolumeController?.isActiveMegaphoneById(ownPlayerId)
    ev.dataDumper.dump('megaphoneIsOn', String(isActiveMegaphone))
  }
}
