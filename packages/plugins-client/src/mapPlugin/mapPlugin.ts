import type { NetworkPluginStore } from '@churaverse/network-plugin-client'
import { BasePlugin, type IMainScene, type PhaserSceneInit, type UtilStoreInMain } from 'churaverse-engine-client'
import { SocketController } from './controller/socketController'
import { MapManagerUndefinedError } from './error/mapManagerUndefinedError'
import type { ChangeMapEvent } from './event/changeMapEvent'
import type { DidChangeMapEvent } from './event/didChangeMapEvent'
import { DidInitMapEvent } from './event/didInitMapEvent'
import type { InitMapEvent } from './event/initMapEvent'
import { MapManager } from './mapManager'
import { RequestChangeMapDataMessage } from './message/changeMapMessage'
import { MapRendererFactory } from './renderer/mapRendererFactory'
import { initMapPluginStore } from './store/initMapPluginStore'
import type { MapSelector } from './ui/mapSelector/mapSelector'
import { setupMapUi } from './ui/setupMapUi'
import '@churaverse/transition-plugin-client'

export class MapPlugin extends BasePlugin<IMainScene> {
  private mapManager?: MapManager
  private rendererFactory?: MapRendererFactory
  private networkStore!: NetworkPluginStore<IMainScene>
  private utilStore!: UtilStoreInMain
  private mapSelector?: MapSelector

  public listenEvent(): void {
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('init', this.getStores.bind(this))
    this.bus.subscribeEvent('start', this.start.bind(this))

    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
    this.bus.subscribeEvent('registerMessageListener', socketController.registerMessageListener.bind(socketController))

    this.bus.subscribeEvent('initMap', this.onInitMap.bind(this))
    this.bus.subscribeEvent('didInitMap', this.onDidInitMap.bind(this))
    this.bus.subscribeEvent('changeMap', this.onChangeMap.bind(this))
    this.bus.subscribeEvent('didChangeMap', this.onDidChangeMap.bind(this))
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.rendererFactory = new MapRendererFactory(ev.scene)
  }

  private init(): void {
    this.mapManager = new MapManager()
    initMapPluginStore(this.store, this.mapManager)
  }

  private getStores(): void {
    this.utilStore = this.store.of('util')
    this.networkStore = this.store.of('networkPlugin')
  }

  private start(): void {
    if (this.mapManager === undefined) throw new MapManagerUndefinedError()
    this.mapSelector = setupMapUi(this.store, this.bus, this.mapManager)
  }

  private onInitMap(ev: InitMapEvent): void {
    if (this.mapManager === undefined) throw new MapManagerUndefinedError()
    this.mapManager
      .reloadMap(ev.mapId)
      .then(() => {
        this.bus.post(new DidInitMapEvent(ev.mapId))
      })
      .catch((err) => {
        throw err
      })
  }

  private onDidInitMap(ev: DidInitMapEvent): void {
    if (this.mapManager === undefined) throw new MapManagerUndefinedError()

    this.mapSelector?.updateSelected(ev.mapId)

    const currentMap = this.mapManager.currentMap
    const mapConfigInfo = this.mapManager.getMapConfigInfo(ev.mapId)
    void this.rendererFactory
      ?.build(currentMap.mapId, mapConfigInfo.drawingLayerNames, mapConfigInfo.jsonName, mapConfigInfo.tilesets)
      .catch((err) => {
        throw err
      })
  }

  private onChangeMap(ev: ChangeMapEvent): void {
    this.changeMap(ev.mapId).catch((err) => {
      throw err
    })
  }

  private async changeMap(mapId: string): Promise<void> {
    this.networkStore.messageSender.send(new RequestChangeMapDataMessage({ mapId }))
  }

  private onDidChangeMap(_ev: DidChangeMapEvent): void {
    window.alert(`マップが変更されました。再度入場してください。`)
    this.store.of('transitionPlugin').transitionManager.transitionTo('TitleScene')
  }
}
