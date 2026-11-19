import {
  BaseSocketController,
  type RegisterMessageEvent,
  type RegisterMessageListenerEvent,
} from '@churaverse/network-plugin-server'
import { EntitySpawnEvent, type IMainScene, Position } from 'churaverse-engine-server'
import { Bomb } from '../domain/bomb'
import { BombExplosionMessage } from '../message/bombExplosionMessage'
import { BombSpawnMessage } from '../message/bombSpawnMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('bombSpawn', BombSpawnMessage, 'others')
    ev.messageRegister.registerMessage('bombExplosion', BombExplosionMessage, 'allClients')
  }

  public registerMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    ev.messageListenerRegister.on('bombSpawn', this.bombSpawn.bind(this))
  }

  private bombSpawn(msg: BombSpawnMessage, senderId: string): void {
    const data = msg.data
    const position = new Position(data.startPos.x, data.startPos.y)
    const bomb = new Bomb(data.bombId, senderId, position, data.direction, data.spawnTime)
    const bombSpawnEvent = new EntitySpawnEvent(bomb)
    this.eventBus.post(bombSpawnEvent)
  }
}
