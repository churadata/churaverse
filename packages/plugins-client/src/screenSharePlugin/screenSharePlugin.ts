import type { DebugScreenPluginStore, DumpDebugDataEvent } from '@churaverse/debug-screen-plugin-client'
import { DebugDetailScreenSection } from '@churaverse/debug-screen-plugin-client'
import type { GroundScreenPluginStore, IGroundScreenRenderer } from '@churaverse/ground-screen-plugin-client'
import type { PlayerNameChangeEvent, PlayerPluginStore } from '@churaverse/player-plugin-client'
import { isPlayer } from '@churaverse/player-plugin-client'
import type { WebRtcPluginStore } from '@churaverse/web-rtc-plugin-client'
import { BasePlugin, type EntitySpawnEvent, type IMainScene, type PhaserSceneInit } from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import type {
  IScreenShareIdDebugDetailScreen,
  IScreenShareMyStatusDebugDetailScreen,
} from './debugScreen/IDebugScreen/IScreenShareInfoDebugDetailScreen'
import { ScreenShareIdDebugDetailScreen } from './debugScreen/screenShareIdDebugDetailScreen'
import { ScreenShareMyStatusDebugDetailScreen } from './debugScreen/screenShareMyStatusDebugDetailScreen'
import type { StartScreenShare } from './event/startScreenShareEvent'
import type { StopScreenShare } from './event/stopScreenShareEvent'
import { ScreenShareReceiver } from './screenShareReceiver'
import { ScreenShareSender } from './screenShareSender'
import { PlayerScreenShareIcon } from './ui/PlayerScreenShareIcon'
import { ScreenShareUi } from './ui/screenShareUi'

export class ScreenSharePlugin extends BasePlugin<IMainScene> {
  private webRtcPluginStore!: WebRtcPluginStore
  private groundScreenPluginStore!: GroundScreenPluginStore
  private playerPluginStore!: PlayerPluginStore
  private debugScreenPluginStore!: DebugScreenPluginStore

  private screenShareUi?: ScreenShareUi
  private readonly sharedScreenRenderers: Map<string, IGroundScreenRenderer> = new Map()
  private screenShareSender?: ScreenShareSender
  private screenShareIdDebugDetailScreen!: IScreenShareIdDebugDetailScreen
  private screenShareMyStatusDebugDetailScreen!: IScreenShareMyStatusDebugDetailScreen

  private scene?: Scene
  private readonly screenShareIcons: Map<string, PlayerScreenShareIcon> = new Map()

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('start', this.start.bind(this))
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('entitySpawn', this.onJoinPlayer.bind(this))
    this.bus.subscribeEvent('startScreenShare', this.onStartScreenShare.bind(this))
    this.bus.subscribeEvent('stopScreenShare', this.onStopScreenShare.bind(this))
    this.bus.subscribeEvent('dumpDebugData', this.dumpDebugData.bind(this))
    this.bus.subscribeEvent('playerNameChange', this.onChangePlayerName.bind(this))
  }

  private init(): void {
    this.getStores()

    void new ScreenShareReceiver(this.webRtcPluginStore.webRtc.room, this.bus)
    this.screenShareSender = new ScreenShareSender(this.webRtcPluginStore.webRtc.room, this.bus)
    this.screenShareUi = new ScreenShareUi(this.store, this.screenShareSender)
  }

  private getStores(): void {
    this.webRtcPluginStore = this.store.of('webRtcPlugin')
    this.groundScreenPluginStore = this.store.of('groundScreenPlugin')
    this.playerPluginStore = this.store.of('playerPlugin')
    this.debugScreenPluginStore = this.store.of('debugScreenPlugin')
  }

  private start(): void {
    this.setupDebugScreen()
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.scene = ev.scene
  }

  private onJoinPlayer(ev: EntitySpawnEvent): void {
    if (!isPlayer(ev.entity)) return
    if (this.scene === undefined) return
    const renderer = this.playerPluginStore.playerRenderers.get(ev.entity.id)
    if (renderer === undefined) return
    this.screenShareIcons.set(ev.entity.id, new PlayerScreenShareIcon(this.scene, renderer))
  }

  private setupDebugScreen(): void {
    const debugDetailScreenContainer = this.debugScreenPluginStore.debugDetailScreenContainer
    debugDetailScreenContainer.addSection(new DebugDetailScreenSection('screenShareInfo', 'ScreenShare'))
    this.screenShareIdDebugDetailScreen = new ScreenShareIdDebugDetailScreen(debugDetailScreenContainer)
    this.screenShareMyStatusDebugDetailScreen = new ScreenShareMyStatusDebugDetailScreen(debugDetailScreenContainer)
  }

  private onStartScreenShare(ev: StartScreenShare): void {
    // 既存の画面共有を停止
    if (this.sharedScreenRenderers.has(this.playerPluginStore.ownPlayerId)) {
      this.screenShareSender
        ?.stopStream()
        .then((success) => {
          if (success) {
            this.screenShareUi?.screenShareIcon.deactivate()
          }
        })
        .catch((err) => {
          throw err
        })
    }

    if (this.playerPluginStore.players.get(ev.sharerId) === undefined) return
    this.screenShareIcons.get(ev.sharerId)?.show()
    this.showFooterForPlayer(ev.sharerId)

    this.sharedScreenRenderers.set(
      ev.sharerId,
      this.groundScreenPluginStore.groundScreenRendererFactory.build(ev.video)
    )
    this.screenShareIdDebugDetailScreen.update(ev.sharerId)

    if (ev.sharerId === this.playerPluginStore.ownPlayerId) {
      this.screenShareUi?.screenShareIcon.activate()
      this.screenShareMyStatusDebugDetailScreen.update(true)
    }
  }

  private onStopScreenShare(ev: StopScreenShare): void {
    this.screenShareIcons.get(ev.sharerId)?.hide()
    this.sharedScreenRenderers.get(ev.sharerId)?.destroy()
    this.sharedScreenRenderers.delete(ev.sharerId)
    if (this.sharedScreenRenderers.size === 0) {
      this.screenShareUi?.screenShareFooter.hide()
    } else {
      const remainingSharerId = this.sharedScreenRenderers.keys().next().value
      if (remainingSharerId === undefined) return
      this.showFooterForPlayer(remainingSharerId)
    }
    this.screenShareIdDebugDetailScreen.update(ev.sharerId)

    if (ev.sharerId === this.playerPluginStore.ownPlayerId) {
      this.screenShareUi?.screenShareIcon.deactivate()
      this.screenShareMyStatusDebugDetailScreen.update(false)
    }
  }

  private dumpDebugData(ev: DumpDebugDataEvent): void {
    const ownPlayerId = this.playerPluginStore.ownPlayerId
    const ownParticipant = this.webRtcPluginStore.webRtc.room.getParticipantByIdentity(ownPlayerId)
    const ownScreenShareStatus =
      ownParticipant !== undefined ? String(ownParticipant.isScreenShareEnabled) : 'undefined'
    ev.dataDumper.dump('screenShareIsOn', ownScreenShareStatus)

    const screenShareEnabledIds: string[] = []
    for (const id of this.playerPluginStore.players.getAllId()) {
      const participant = this.webRtcPluginStore.webRtc.room.getParticipantByIdentity(id)
      if (participant === undefined) continue
      if (!participant.isScreenShareEnabled) continue
      screenShareEnabledIds.push(id)
    }
    const idsText = screenShareEnabledIds.length > 0 ? screenShareEnabledIds.join(', ') : ''
    ev.dataDumper.dump('screenShareId', `${screenShareEnabledIds.length}: ${idsText}`)
  }

  private onChangePlayerName(ev: PlayerNameChangeEvent): void {
    const id = ev.id
    if (!this.sharedScreenRenderers.has(id)) return
    this.showFooterForPlayer(id)
  }

  private showFooterForPlayer(playerId: string): void {
    const player = this.playerPluginStore.players.get(playerId)
    if (player === undefined) return
    const isOwn = playerId === this.playerPluginStore.ownPlayerId
    this.screenShareUi?.screenShareFooter.show(player.name, isOwn)
  }
}
