import { BaseGamePlugin } from '@churaverse/game-plugin-client'
import './keyAction/defKeyAction'
import { CHURAREN_CONSTANTS } from '@churaverse/churaren-core-plugin-client'
import type { KeyboardPluginStore } from '@churaverse/keyboard-plugin-client'
import type { NetworkPluginStore } from '@churaverse/network-plugin-client'
import type { PlayerPluginStore } from '@churaverse/player-plugin-client'
import type { IMainScene, PhaserLoadAssets, PhaserSceneInit } from 'churaverse-engine-client'
import { KeyboardController } from './controller/keyboardController'
import { SocketController } from './controller/socketController'
import '@churaverse/churaren-core-plugin-client'
import type { PlayerItemsStore } from '@churaverse/churaren-player-plugin-client'
import { AlchemyItem } from './domain/alchemyItem'
import type { AlchemyItemKind } from './domain/alchemyItemKind'
import type { AlchemizeEvent } from './event/alchemizeEvent'
import type { AlchemyPotSpawnEvent } from './event/alchemyPotSpawnEvent'
import type { ClearAlchemyItemBoxEvent } from './event/clearAlchemyItemBox'
import { ClearAlchemyItemBoxMessage } from './message/clearAlchemyItemBoxMessage'
import { AlchemyPotRenderer } from './renderer/alchemyPotRenderer'
import { AlchemyPotRendererFactory } from './renderer/alchemyPotRendererFactory'
import type { AlchemyPluginStore } from './store/defAlchemyPluginStore'
import { initAlchemyPluginStore, resetAlchemyPluginStore } from './store/initAlchemyPluginStore'

export class ChurarenAlchemyPlugin extends BaseGamePlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  private scene!: Phaser.Scene
  private alchemyPluginStore!: AlchemyPluginStore
  private rendererFactory?: AlchemyPotRendererFactory
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private playerItemStore!: PlayerItemsStore
  private keyboardStore?: KeyboardPluginStore<IMainScene>
  private playerPluginStore!: PlayerPluginStore
  private socketController?: SocketController
  private keyboardController?: KeyboardController

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('phaserLoadAssets', this.loadAssets.bind(this))

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupMessageListenerRegister.bind(this.socketController)
    )

    this.keyboardController = new KeyboardController(this.bus, this.store)
    this.bus.subscribeEvent(
      'registerKayAction',
      this.keyboardController.registerKeyAction.bind(this.keyboardController)
    )
    this.bus.subscribeEvent(
      'registerKeyActionListener',
      this.keyboardController.setupKeyActionListenerRegister.bind(this.keyboardController)
    )
  }

  private init(): void {
    this.networkPluginStore = this.store.of('networkPlugin')
    this.keyboardStore = this.store.of('keyboardPlugin')
    this.playerPluginStore = this.store.of('playerPlugin')
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.scene = ev.scene
    this.rendererFactory = new AlchemyPotRendererFactory(this.scene)
  }

  private loadAssets(ev: PhaserLoadAssets): void {
    AlchemyPotRenderer.loadAssets(ev.scene)
  }

  private setupKeyAction(): void {
    this.keyboardStore?.keySettingWindow.addKeyAction('useAlchemyItem', '錬金アイテムを使用する')
  }

  private resetKeyAction(): void {
    this.keyboardStore?.keySettingWindow.removeKeyAction('useAlchemyItem')
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('alchemyPotSpawn', this.spawnAlchemyPot)
    this.bus.subscribeEvent('alchemize', this.alchemize)
    this.bus.subscribeEvent('clearAlchemyItemBox', this.clearAlchemyItem)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('alchemyPotSpawn', this.spawnAlchemyPot)
    this.bus.unsubscribeEvent('alchemize', this.alchemize)
    this.bus.unsubscribeEvent('clearAlchemyItemBox', this.clearAlchemyItem)
  }

  protected handleGameStart(): void {
    initAlchemyPluginStore(this.scene, this.store, this.rendererFactory)
    this.playerItemStore = this.store.of('playerItemStore')
    this.alchemyPluginStore = this.store.of('alchemyPlugin')
    this.setupKeyAction()
    this.socketController?.registerMessageListener()
    this.keyboardController?.getStores()
    this.keyboardController?.registerKeyActionListener()
  }

  protected handleGameTermination(): void {
    this.alchemyPluginStore.alchemyPotRenderers.forEach((renderer) => {
      if (renderer === undefined) return
      renderer.destroy()
    })
    this.keyboardController?.unregisterKeyActionListener()
    this.socketController?.unregisterMessageListener()
    this.resetKeyAction()
    resetAlchemyPluginStore(this.store)
  }

  protected handleMidwayJoin(): void {
    this.unsubscribeGameEvent()
  }

  private readonly spawnAlchemyPot = (ev: AlchemyPotSpawnEvent): void => {
    ev.alchemyPots.forEach((pot) => {
      const renderer = this.alchemyPluginStore.alchemyPotRendererFactory.build()
      this.alchemyPluginStore.alchemyPots.set(pot.potId, pot)
      this.alchemyPluginStore.alchemyPotRenderers.set(pot.potId, renderer)
      renderer.spawn(pot.position)
    })
  }

  private readonly alchemize = (ev: AlchemizeEvent): void => {
    // 削除するアイテムの処理
    ev.deletedItemIds.forEach((deletedItemId) => {
      this.playerItemStore.materialItems.delete(ev.playerId, deletedItemId)
      const materialItemRenderer = this.playerItemStore.materialItemRenderers.get(deletedItemId)
      if (materialItemRenderer === undefined) return
      materialItemRenderer.destroy()
      this.playerItemStore.materialItemRenderers.delete(deletedItemId)
    })

    const alchemyItem = new AlchemyItem(ev.itemId, ev.kind)
    this.playerItemStore.alchemyItem.set(ev.playerId, alchemyItem)
    const renderer = this.alchemyPluginStore.alchemyItemManager?.get(ev.kind).rendererFactory.build()
    if (renderer === undefined) return
    this.playerItemStore.alchemyItemRenderers.set(ev.itemId, renderer)
    if (ev.playerId !== this.playerPluginStore.ownPlayerId) return
    this.changeItemBox(ev.kind)
  }

  private readonly clearAlchemyItem = (ev: ClearAlchemyItemBoxEvent): void => {
    const alchemyItem = this.playerItemStore.alchemyItem.get(ev.playerId)
    if (alchemyItem == null) return
    const renderer = this.playerItemStore.alchemyItemRenderers.get(alchemyItem.itemId)
    if (renderer === undefined) return
    renderer.destroy()
    this.playerItemStore.alchemyItem.delete(ev.playerId)
    this.playerItemStore.alchemyItemRenderers.delete(alchemyItem.itemId)

    if (ev.playerId === this.playerPluginStore.ownPlayerId) {
      this.playerItemStore.alchemyItemBoxContainer.updateAlchemyItemBox('')
      const clearAlchemyItemBoxData = { playerId: ev.playerId }
      const clearAlchemyItemBoxMessage = new ClearAlchemyItemBoxMessage(clearAlchemyItemBoxData)
      this.networkPluginStore.messageSender.send(clearAlchemyItemBoxMessage)
    }
  }

  private changeItemBox(kind: AlchemyItemKind): void {
    const itemImagePaths = this.alchemyPluginStore.alchemyItemManager?.get(kind)?.image ?? ''
    this.playerItemStore.materialItemBoxContainer.updateMaterialItemBox([])
    this.playerItemStore.alchemyItemBoxContainer.updateAlchemyItemBox(itemImagePaths)
  }
}
