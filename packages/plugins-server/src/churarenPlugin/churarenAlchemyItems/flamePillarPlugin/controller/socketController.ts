import type {
  IMessageListenerRegister,
  RegisterMessageEvent,
  RegisterMessageListenerEvent,
} from '@churaverse/network-plugin-server'
import { BaseSocketController } from '@churaverse/network-plugin-server'
import { EntitySpawnEvent, type IEventBus, type IMainScene, Position, type Store } from 'churaverse-engine-server'
import { FlamePillar } from '../domain/flamePillar'
import { FlamePillarHitMessage } from '../message/flamePillarHitMessage'
import { FlamePillarSpawnMessage } from '../message/flamePillarSpawnMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('flamePillarSpawn', FlamePillarSpawnMessage, 'others')
    ev.messageRegister.registerMessage('flamePillarHit', FlamePillarHitMessage, 'allClients')
  }

  public setupRegisterMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('flamePillarSpawn', this.flamePillarSpawn)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('flamePillarSpawn', this.flamePillarSpawn)
  }

  private readonly flamePillarSpawn = (msg: FlamePillarSpawnMessage, senderId: string): void => {
    const data = msg.data
    const position = new Position(data.startPos.x, data.startPos.y)
    const flamePillar = new FlamePillar(data.flamePillarId, senderId, position, data.direction, data.spawnTime)
    const flamePillarSpawnEvent = new EntitySpawnEvent(flamePillar)
    this.eventBus.post(flamePillarSpawnEvent)
  }
}
