import type {
  IMessageListenerRegister,
  RegisterMessageEvent,
  RegisterMessageListenerEvent,
} from '@churaverse/network-plugin-client'
import { BaseSocketController } from '@churaverse/network-plugin-client'
import { type IEventBus, type IMainScene, LivingHealEvent, type Store } from 'churaverse-engine-client'
import { UseHealingPotionMessage } from '../message/useHealingPotionMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('useHealingPotion', UseHealingPotionMessage, 'queue')
  }

  public setupMessageListenerRegister(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('useHealingPotion', this.useHealingPotion)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('useHealingPotion', this.useHealingPotion)
  }

  private readonly useHealingPotion = (msg: UseHealingPotionMessage): void => {
    const data = msg.data
    const player = this.store.of('playerPlugin').players.get(data.playerId)
    if (player === undefined) return
    const playerHealEvent = new LivingHealEvent(player, data.healAmount)
    this.eventBus.post(playerHealEvent)
  }
}
