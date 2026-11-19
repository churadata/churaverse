import { CookieStore } from '@churaverse/data-persistence-plugin-client'
import { type NetworkPluginStore, Socket } from '@churaverse/network-plugin-client'
import type { IPlayerRenderer } from '@churaverse/player-plugin-client'
import {
  DEFAULT_HP,
  PLAYER_COLOR_NAMES,
  Player,
  PlayerRenderer,
  PlayerRendererFactory,
  PlayerSetupInfoReader,
} from '@churaverse/player-plugin-client'
import type { WillSceneTransitionEvent } from '@churaverse/transition-plugin-client'
import {
  BasePlugin,
  Direction,
  type IMainScene,
  type InitEvent,
  type ITitleScene,
  type PhaserLoadAssets,
  type PhaserSceneInit,
  Position,
  type Scenes,
  type StartEvent,
} from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import { SocketController } from './controller/socketController'
import type { TitlePlayerColorChangeEvent } from './event/titlePlayerColorChangeEvent'
import type { TitlePlayerListReceivedEvent } from './event/titlePlayerListReceivedEvent'
import type { TitlePlayerNameChangeEvent } from './event/titlePlayerNameChangeEvent'
import type { TitlePlayerPluginStore } from './store/defTitlePlayerPlugin'
import { initTitlePlayerPluginStore } from './store/initTitlePlayerPlugin'
import { PlayerListToggleRenderer } from './ui/renderer/playerListToggleRenderer'
import { TitleArrowButtonRenderer } from './ui/renderer/titleArrowButtonRenderer'
import { TitleNameFieldRenderer } from './ui/renderer/titleNameFieldRenderer'
import { TitlePlayerRoleRenderer } from './ui/renderer/titlePlayerRoleRenderer'
import { setupTitlePlayerUi } from './ui/setupTitlePlayerUi'

export class TitlePlayerPlugin extends BasePlugin<ITitleScene> {
  private scene!: Scene
  private playerRendererFactory!: PlayerRendererFactory
  private playerSetupInfoReader!: PlayerSetupInfoReader
  private networkStore!: NetworkPluginStore<ITitleScene>
  private titlePlayerPluginStore!: TitlePlayerPluginStore
  private ownPlayer!: Player
  private playerListToggleRenderer!: PlayerListToggleRenderer

  public listenEvent(): void {
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('phaserLoadAssets', this.loadAssets.bind(this))

    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('start', this.start.bind(this))

    this.bus.subscribeEvent('titlePlayerColorChange', this.changePlayerColor.bind(this))
    this.bus.subscribeEvent('titlePlayerNameChange', this.changePlayerName.bind(this))
    this.bus.subscribeEvent('willSceneTransition', this.willSceneTransition.bind(this))
    this.bus.subscribeEvent('titlePlayerListReceived', this.onTitlePlayerListReceived.bind(this))

    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
    this.bus.subscribeEvent('registerMessageListener', socketController.registerMessageListener.bind(socketController))
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.playerRendererFactory = new PlayerRendererFactory(ev.scene)
    this.scene = ev.scene
  }

  private loadAssets(ev: PhaserLoadAssets): void {
    PlayerRenderer.loadAssets(ev.scene)
    TitleArrowButtonRenderer.loadAssets(ev.scene)
  }

  private init(_ev: InitEvent): void {
    this.playerSetupInfoReader = new PlayerSetupInfoReader(new CookieStore())
    this.networkStore = this.store.of('networkPlugin')
    this.ownPlayer = this.createOwnPlayer()
    initTitlePlayerPluginStore(
      this.store,
      this.ownPlayer,
      this.createPreviewPlayer(this.ownPlayer),
      new TitleNameFieldRenderer(this.bus, this.playerSetupInfoReader.read().name ?? ''),
      new TitlePlayerRoleRenderer(this.scene, this.playerSetupInfoReader)
    )
    this.titlePlayerPluginStore = this.store.of('titlePlayerPlugin')
    this.playerListToggleRenderer = new PlayerListToggleRenderer()
  }

  private start(_ev: StartEvent): void {
    setupTitlePlayerUi(this.scene, this.store, this.bus)
  }

  private createOwnPlayer(): Player {
    const pos = new Position(800, 440)
    const direction = Direction.down
    const ownPlayer = new Player(
      this.networkStore.socketId,
      pos,
      direction,
      this.playerSetupInfoReader.read().name ?? '',
      this.playerSetupInfoReader.read().color ??
        PLAYER_COLOR_NAMES[Math.floor(Math.random() * PLAYER_COLOR_NAMES.length)],
      DEFAULT_HP,
      this.playerSetupInfoReader.read().role ?? 'user'
    )
    return ownPlayer
  }

  private createPreviewPlayer(ownPlayer: Player): IPlayerRenderer {
    const pos = new Position(0, 0)
    const previewPlayer = this.playerRendererFactory.build(
      pos,
      ownPlayer.direction,
      ownPlayer.name,
      ownPlayer.color,
      ownPlayer.hp
    )
    return previewPlayer
  }

  private changePlayerColor(ev: TitlePlayerColorChangeEvent): void {
    this.titlePlayerPluginStore.ownPlayer.setColor(ev.color)
    this.titlePlayerPluginStore.previewPlayer.applyPlayerColor(ev.color)
  }

  private changePlayerName(ev: TitlePlayerNameChangeEvent): void {
    this.titlePlayerPluginStore.ownPlayer.setName(ev.name)
    this.titlePlayerPluginStore.previewPlayer.applyPlayerName(ev.name)
  }

  private willSceneTransition(ev: WillSceneTransitionEvent<ITitleScene, Scenes>): void {
    if (ev.to !== 'MainScene') return
    // 遷移先にplayerのインスタンスをownPlayerをキーとして渡す
    // ev.sceneDataTransporter.push<IMainScene, 'ownPlayer'>('ownPlayer', this.ownPlayer)

    // playerのidがundefinedになってる問題があるから、とりあえずidだけ設定しなおして渡してる。
    const player = new Player(
      Socket.build().socketId,
      this.ownPlayer.position,
      this.ownPlayer.direction,
      this.ownPlayer.name,
      this.ownPlayer.color,
      this.ownPlayer.hp,
      this.ownPlayer.role,
      this.ownPlayer.spawnTime
    )
    ev.sceneDataTransporter.push<IMainScene, 'ownPlayer'>('ownPlayer', player)
  }

  private onTitlePlayerListReceived(ev: TitlePlayerListReceivedEvent): void {
    this.playerListToggleRenderer.update(ev.players)
  }
}
