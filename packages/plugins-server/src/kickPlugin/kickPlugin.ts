import { BasePlugin, type IMainScene } from 'churaverse-engine-server'
import { SocketController } from './controller/socketController'

export class KickPlugin extends BasePlugin<IMainScene> {
  public listenEvent(): void {
    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
  }
}
