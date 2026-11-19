import { CHURAREN_CONSTANTS } from '@churaverse/churaren-core-plugin-client'
import { BaseGamePlugin } from '@churaverse/game-plugin-client'
import type { PhaserLoadAssets, PhaserSceneInit } from 'churaverse-engine-client'
import { SocketController } from './controller/socketController'
import { ItemRenderer } from './renderer/itemRenderer'
import { ItemRendererFactory } from './renderer/itemRendererFactory'
import type { ItemPluginStore } from './store/defItemPluginStore'
import { initItemPluginStore, resetItemPluginStore } from './store/initItemPluginStore'
import '@churaverse/churaren-core-plugin-client'
import type { ChurarenItemDespawnEvent } from './event/churarenItemDespawnEvent'
import type { ChurarenItemSpawnEvent } from './event/churarenItemSpawnEvent'

export class ChurarenItemPlugin extends BaseGamePlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  private rendererFactory?: ItemRendererFactory
  private itemPluginStore!: ItemPluginStore
  private socketController?: SocketController

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('phaserLoadAssets', this.loadAssets.bind(this))

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupMessageListenerRegister.bind(this.socketController)
    )
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('churarenItemSpawn', this.spawnItem)
    this.bus.subscribeEvent('churarenItemDespawn', this.removeItems)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('churarenItemSpawn', this.spawnItem)
    this.bus.unsubscribeEvent('churarenItemDespawn', this.removeItems)
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.rendererFactory = new ItemRendererFactory(ev.scene)
  }

  private loadAssets(ev: PhaserLoadAssets): void {
    ItemRenderer.loadAssets(ev.scene)
  }

  private setupChurarenItemPlugin(): void {
    initItemPluginStore(this.store, this.rendererFactory)
    this.itemPluginStore = this.store.of('churarenItemPlugin')
    this.socketController?.getStore()
    this.socketController?.registerMessageListener()
  }

  public handleGameStart(): void {
    this.setupChurarenItemPlugin()
  }

  public handleGameTermination(): void {
    this.itemPluginStore.itemRenderers.forEach((renderer) => {
      renderer.destroy()
    })
    this.socketController?.unregisterMessageListener()
    resetItemPluginStore(this.store)
  }

  public handleMidwayJoin(): void {
    this.unsubscribeGameEvent()
  }

  private readonly spawnItem = (ev: ChurarenItemSpawnEvent): void => {
    ev.items.forEach((item) => {
      const itemRenderer = this.itemPluginStore.itemRendererFactory.build(item.kind)
      this.itemPluginStore.items.set(item.itemId, item)
      this.itemPluginStore.itemRenderers.set(item.itemId, itemRenderer)
      itemRenderer.spawn(item.position)
    })
  }

  private readonly removeItems = (ev: ChurarenItemDespawnEvent): void => {
    ev.itemIds.forEach((itemId) => {
      const itemRenderer = this.itemPluginStore.itemRenderers.get(itemId)
      if (itemRenderer === undefined) {
        return
      }

      itemRenderer.destroy()
      this.itemPluginStore.items.delete(itemId)
      this.itemPluginStore.itemRenderers.delete(itemId)
    })
  }
}
