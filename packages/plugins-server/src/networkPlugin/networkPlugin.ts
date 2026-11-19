import { BasePlugin, EVENT_PRIORITY, type InitEvent, type Scenes } from 'churaverse-engine-server'
import { SocketController } from './controller/socketController'
import { MessageManagerUndefinedError } from './errors/messageManagerUndefinedError'
import type { NetworkConnectionEvent } from './event/networkConnectionEvent'
import type { NetworkDisconnectEvent } from './event/networkDisconnectEvent'
import { RegisterMessageEvent } from './event/registerMessageEvent'
import { RegisterMessageListenerEvent } from './event/registerMessageListenerEvent'
import { MessageManager } from './messageManager'
import { initNetworkPluginStore } from './store/initNetworkPluginStore'

export class NetworkPlugin extends BasePlugin<Scenes> {
  private messageManager?: MessageManager<Scenes>

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('start', this.listenRegister.bind(this), EVENT_PRIORITY.HIGH)

    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
    this.bus.subscribeEvent('registerMessageListener', socketController.registerMessageListener.bind(socketController))

    this.bus.subscribeEvent('update', this.update.bind(this))

    this.bus.subscribeEvent('networkConnection', this.onNetworkConnection.bind(this))
    this.bus.subscribeEvent('networkDisconnect', this.onNetworkDisconnect.bind(this))
  }

  private async init(ev: InitEvent): Promise<void> {
    const isMessageSenderScene = ev.sceneName === 'MainScene'
    this.messageManager = new MessageManager(ev.server, isMessageSenderScene)
    this.messageManager.socketEventToBusEvent(this.bus)
    initNetworkPluginStore(this.store, this.messageManager)
  }

  /**
   * Message登録イベントとMessageListener登録イベントをpostする
   */
  private listenRegister(): void {
    if (this.messageManager === undefined) throw new MessageManagerUndefinedError()
    this.bus.post(new RegisterMessageEvent(this.messageManager))
    this.bus.post(new RegisterMessageListenerEvent(this.messageManager))
  }

  private update(): void {
    if (this.messageManager === undefined) throw new MessageManagerUndefinedError()

    this.messageManager.update()

    if (this.messageManager.shouldSendPacket()) {
      this.messageManager.sendPacket()
    }
  }

  private onNetworkConnection(ev: NetworkConnectionEvent): void {
    this.messageManager?.addQueue(ev.socketId)
  }

  private onNetworkDisconnect(ev: NetworkDisconnectEvent): void {
    this.messageManager?.removeQueue(ev.socketId)
  }
}
