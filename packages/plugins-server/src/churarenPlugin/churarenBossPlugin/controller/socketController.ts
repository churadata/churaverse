import type {
  IMessageListenerRegister,
  RegisterMessageEvent,
  RegisterMessageListenerEvent,
} from '@churaverse/network-plugin-server'
import { BaseSocketController } from '@churaverse/network-plugin-server'
import type { IEventBus, IMainScene, Store } from 'churaverse-engine-server'
import { BossDespawnMessage } from '../message/bossDespawnMessage'
import { BossSpawnMessage } from '../message/bossSpawnMessage'
import { BossWalkMessage } from '../message/bossWalkMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('bossSpawn', BossSpawnMessage, 'allClients')
    ev.messageRegister.registerMessage('bossDespawn', BossDespawnMessage, 'allClients')
    ev.messageRegister.registerMessage('bossWalk', BossWalkMessage, 'allClients')
  }

  public setupMessageListenerRegister(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }
}
