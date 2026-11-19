import { ChurarenDamageMessage } from '@churaverse/churaren-core-plugin-server'
import type {
  IMessageListenerRegister,
  RegisterMessageEvent,
  RegisterMessageListenerEvent,
} from '@churaverse/network-plugin-server'
import { BaseSocketController } from '@churaverse/network-plugin-server'
import type { IEventBus, IMainScene, Store } from 'churaverse-engine-server'
import { DropChurarenItemEvent } from '../event/dropChurarenItemEvent'
import { DropChurarenItemMessage } from '../message/dropChurarenItemMessage'
import { GetChurarenItemMessage } from '../message/getChurarenItemMessage'
import { InvicibleTimeMessage } from '../message/invicibleTimeMessage'
import { PlayerRevivalMessage } from '../message/playerRevivalMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('invicibleTime', InvicibleTimeMessage, 'allClients')
    ev.messageRegister.registerMessage('getChurarenItem', GetChurarenItemMessage, 'allClients')
    ev.messageRegister.registerMessage('dropChurarenItem', DropChurarenItemMessage, 'others')
    ev.messageRegister.registerMessage('churarenDamage', ChurarenDamageMessage, 'allClients')
    ev.messageRegister.registerMessage('playerRevival', PlayerRevivalMessage, 'allClients')
  }

  public setupMessageListenerRegister(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('dropChurarenItem', this.dropItem)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('dropChurarenItem', this.dropItem)
  }

  private readonly dropItem = (msg: DropChurarenItemMessage): void => {
    const data = msg.data
    const dropItemEvent = new DropChurarenItemEvent(data.playerId, data.itemId)
    this.eventBus.post(dropItemEvent)
  }
}
