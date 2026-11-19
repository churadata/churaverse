import type {
  IMessageListenerRegister,
  RegisterMessageEvent,
  RegisterMessageListenerEvent,
} from '@churaverse/network-plugin-server'
import { BaseSocketController } from '@churaverse/network-plugin-server'
import type { IEventBus, IMainScene, Store } from 'churaverse-engine-server'
import { UseRevivalItemEvent } from '../event/useRevivalItemEvent'
import { UseRevivalItemMessage } from '../message/useRevivalItemMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('useRevivalItem', UseRevivalItemMessage, 'onlyServer')
  }

  public setupMessageListenerRegister(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('useRevivalItem', this.useRevivalItem)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('useRevivalItem', this.useRevivalItem)
  }

  private readonly useRevivalItem = (msg: UseRevivalItemMessage): void => {
    const data = msg.data
    const playerRevivalEvent = new UseRevivalItemEvent(data.playerId)
    this.eventBus.post(playerRevivalEvent)
  }
}
