import type {
  IMessageListenerRegister,
  RegisterMessageEvent,
  RegisterMessageListenerEvent,
} from '@churaverse/network-plugin-server'
import { BaseSocketController } from '@churaverse/network-plugin-server'
import { EntitySpawnEvent, type IEventBus, type IMainScene, Position, type Store } from 'churaverse-engine-server'
import { Trap } from '../domain/trap'
import { TrapHitMessage } from '../message/trapHitMessage'
import { TrapSpawnMessage } from '../message/trapSpawnMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('trapSpawn', TrapSpawnMessage, 'others')
    ev.messageRegister.registerMessage('trapHit', TrapHitMessage, 'allClients')
  }

  public setupRegisterMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('trapSpawn', this.trapSpawn)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('trapSpawn', this.trapSpawn)
  }

  private readonly trapSpawn = (msg: TrapSpawnMessage, senderId: string): void => {
    const data = msg.data
    const position = new Position(data.startPos.x, data.startPos.y)
    const trap = new Trap(data.trapId, senderId, position, data.direction, data.spawnTime)
    const trapSpawnEvent = new EntitySpawnEvent(trap)
    this.eventBus.post(trapSpawnEvent)
  }
}
