import type {
  IMessageListenerRegister,
  RegisterMessageEvent,
  RegisterMessageListenerEvent,
} from '@churaverse/network-plugin-server'
import { BaseSocketController } from '@churaverse/network-plugin-server'
import { EntitySpawnEvent, type IEventBus, type IMainScene, Position, type Store } from 'churaverse-engine-server'
import { BlackHole } from '../domain/blackHole'
import { BlackHoleDespawnMessage } from '../message/blackHoleDespawnMessage'
import { BlackHoleSpawnMessage } from '../message/blackHoleSpawnMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('blackHoleSpawn', BlackHoleSpawnMessage, 'others')
    ev.messageRegister.registerMessage('blackHoleDespawn', BlackHoleDespawnMessage, 'allClients')
  }

  public setupRegisterMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('blackHoleSpawn', this.blackHoleSpawn)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('blackHoleSpawn', this.blackHoleSpawn)
  }

  private readonly blackHoleSpawn = (msg: BlackHoleSpawnMessage, senderId: string): void => {
    const data = msg.data
    const pos = new Position(data.startPos.x, data.startPos.y)
    const blackHole = new BlackHole(data.blackHoleId, senderId, pos, data.direction, data.spawnTime)
    blackHole.move(Date.now() - data.spawnTime) // 遅延分移動
    const blackHoleSpawnEvent = new EntitySpawnEvent(blackHole)
    this.eventBus.post(blackHoleSpawnEvent)
  }
}
