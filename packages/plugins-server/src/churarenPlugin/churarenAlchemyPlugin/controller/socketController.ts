import type {
  IMessageListenerRegister,
  RegisterMessageEvent,
  RegisterMessageListenerEvent,
} from '@churaverse/network-plugin-server'
import { BaseSocketController } from '@churaverse/network-plugin-server'
import type { IEventBus, IMainScene, Store } from 'churaverse-engine-server'
import { ClearAlchemyItemBoxEvent } from '../event/clearAlchemyItemBoxEvent'
import { AlchemizeMessage } from '../message/alchemizeMessage'
import { AlchemyPotSpawnMessage } from '../message/alchemyPotSpawnMessage'
import { ClearAlchemyItemBoxMessage } from '../message/clearAlchemyItemBoxMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('alchemyPotSpawn', AlchemyPotSpawnMessage, 'allClients')
    ev.messageRegister.registerMessage('alchemize', AlchemizeMessage, 'allClients')
    ev.messageRegister.registerMessage('clearAlchemyItemBox', ClearAlchemyItemBoxMessage, 'others')
  }

  public setupMessageListenerRegister(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('clearAlchemyItemBox', this.clearAlchemyItem)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('clearAlchemyItemBox', this.clearAlchemyItem)
  }

  private readonly clearAlchemyItem = (msg: ClearAlchemyItemBoxMessage): void => {
    const data = msg.data
    const clearAlchemyItemBoxEvent = new ClearAlchemyItemBoxEvent(data.playerId)
    this.eventBus.post(clearAlchemyItemBoxEvent)
  }
}
