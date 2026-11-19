import type { NetworkPluginStore } from '@churaverse/network-plugin-server'
import { BasePlugin, type IMainScene } from 'churaverse-engine-server'
import { SocketController } from './controller/socketController'
import { MapChangeError } from './error/mapChangeError'
import { MapManagerUndefinedError } from './error/mapManagerUndefinedError'
import type { ChangeMapEvent } from './event/changeMapEvent'
import { DidChangeMapEvent } from './event/didChangeMapEvent'
import { MapManager } from './mapManager'
import { ResponseChangeMapDataMessage } from './message/changeMapMessage'
import { initMapPluginStore } from './store/initMapPluginStore'

export class MapPlugin extends BasePlugin<IMainScene> {
  private mapManager?: MapManager
  private networkStore!: NetworkPluginStore<IMainScene>

  public async loading(): Promise<void> {
    const defaultMapFileName = 'Map.json'
    const defaultMapId = 'map1'
    const json = await MapManager.loadMapJSON(defaultMapFileName)
    this.mapManager = new MapManager(json, defaultMapId)
  }

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('init', this.getStores.bind(this))

    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
    this.bus.subscribeEvent('registerMessageListener', socketController.registerMessageListener.bind(socketController))

    this.bus.subscribeEvent('changeMap', this.onChangeMap.bind(this))
    this.bus.subscribeEvent('didChangeMap', this.onDidChangeMap.bind(this))
  }

  private init(): void {
    if (this.mapManager === undefined) throw new MapManagerUndefinedError()
    initMapPluginStore(this.store, this.mapManager)
  }

  private getStores(): void {
    this.networkStore = this.store.of('networkPlugin')
  }

  private onChangeMap(ev: ChangeMapEvent): void {
    if (this.mapManager === undefined) throw new MapManagerUndefinedError()

    this.mapManager
      .reloadMap(ev.mapId)
      .then(() => {
        this.bus.post(new DidChangeMapEvent(ev.mapId, ev.changerId))
      })
      .catch(() => {
        throw new MapChangeError()
      })
  }

  private onDidChangeMap(ev: DidChangeMapEvent): void {
    this.networkStore.messageSender.send(new ResponseChangeMapDataMessage({ mapId: ev.mapId }), ev.changerId)
  }
}
