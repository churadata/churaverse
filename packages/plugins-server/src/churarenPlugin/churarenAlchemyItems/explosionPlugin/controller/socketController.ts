import type {
  IMessageListenerRegister,
  RegisterMessageEvent,
  RegisterMessageListenerEvent,
} from '@churaverse/network-plugin-server'
import { BaseSocketController } from '@churaverse/network-plugin-server'
import { EntitySpawnEvent, type IEventBus, type IMainScene, Position, type Store } from 'churaverse-engine-server'
import { Explosion } from '../domain/explosion'
import { ExplosionHitMessage } from '../message/explosionHitMessage'
import { ExplosionSpawnMessage } from '../message/explosionSpawnMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('explosionSpawn', ExplosionSpawnMessage, 'others')
    ev.messageRegister.registerMessage('explosionHit', ExplosionHitMessage, 'allClients')
  }

  public setupRegisterMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('explosionSpawn', this.explosionSpawn)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('explosionSpawn', this.explosionSpawn)
  }

  private readonly explosionSpawn = (msg: ExplosionSpawnMessage, senderId: string): void => {
    const data = msg.data
    const position = new Position(data.startPos.x, data.startPos.y)
    const explosion = new Explosion(data.explosionId, senderId, position, data.direction, data.spawnTime)
    explosion.move(Date.now() - data.spawnTime) // 遅延分移動
    const explosionSpawnEvent = new EntitySpawnEvent(explosion)
    this.eventBus.post(explosionSpawnEvent)
  }
}
