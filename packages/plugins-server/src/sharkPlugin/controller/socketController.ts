import {
  BaseSocketController,
  type RegisterMessageEvent,
  type RegisterMessageListenerEvent,
} from '@churaverse/network-plugin-server'
import { EntitySpawnEvent, type IMainScene, Position } from 'churaverse-engine-server'
import { Shark } from '../domain/shark'
import { SharkHitMessage } from '../message/sharkHitMessage'
import { SharkSpawnMessage } from '../message/sharkSpawnMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('sharkSpawn', SharkSpawnMessage, 'others')
    ev.messageRegister.registerMessage('sharkHit', SharkHitMessage, 'allClients')
  }

  public registerMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    ev.messageListenerRegister.on('sharkSpawn', this.sharkSpawn.bind(this))
  }

  private sharkSpawn(msg: SharkSpawnMessage, senderId: string): void {
    const data = msg.data
    const position = new Position(data.startPos.x, data.startPos.y)
    const shark = new Shark(data.sharkId, senderId, position, data.direction, data.spawnTime)
    shark.move(Date.now() - data.spawnTime) // 遅延分移動
    const sharkSpawnEvent = new EntitySpawnEvent(shark)
    this.eventBus.post(sharkSpawnEvent)
  }
}
