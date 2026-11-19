import { BasePlugin, type IMainScene } from 'churaverse-engine-server'
import { SocketController } from './controller/socketController'
import { initGamePluginStore } from './store/initGamePluginStore'

export class GamePlugin extends BasePlugin<IMainScene> {
  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))
    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
    this.bus.subscribeEvent('registerMessageListener', socketController.registerMessageListener.bind(socketController))
  }

  private init(): void {
    initGamePluginStore(this.store)
  }
}
