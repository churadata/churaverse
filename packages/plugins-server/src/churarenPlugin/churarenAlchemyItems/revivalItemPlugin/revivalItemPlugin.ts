import { BaseAlchemyItemPlugin } from '@churaverse/churaren-alchemy-plugin-server'
import { SocketController } from './controller/socketController'
import { REVIVAL_ITEM } from './domain/revivalItem'

export class RevivalItemPlugin extends BaseAlchemyItemPlugin {
  private socketController?: SocketController
  protected alchemyItem = REVIVAL_ITEM

  public listenEvent(): void {
    super.listenEvent()
    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupMessageListenerRegister.bind(this.socketController)
    )
  }

  // `UseRevivalItemEvent`は、`ChurarenPlayerPlugin`が処理する
  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
  }

  protected handleGameStart(): void {
    this.socketController?.registerMessageListener()
  }

  protected handleGameTermination(): void {
    this.socketController?.unregisterMessageListener()
  }
}
