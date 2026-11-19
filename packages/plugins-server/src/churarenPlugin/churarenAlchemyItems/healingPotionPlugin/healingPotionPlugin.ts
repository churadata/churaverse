import { BaseAlchemyItemPlugin } from '@churaverse/churaren-alchemy-plugin-server'
import { SocketController } from './controller/socketController'
import { HEALING_POTION_ITEM } from './domain/healingPotion'

export class HealingPotionPlugin extends BaseAlchemyItemPlugin {
  private socketController?: SocketController
  protected alchemyItem = HEALING_POTION_ITEM

  public listenEvent(): void {
    super.listenEvent()
    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupMessageListenerRegister.bind(this.socketController)
    )
  }

  // 回復は`PlayerPlugin`で行っている
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
