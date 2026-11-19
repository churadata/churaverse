import {
  BaseSocketController,
  type RegisterMessageEvent,
  type RegisterMessageListenerEvent,
} from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'
import { DidChangeMapEvent } from '../event/didChangeMapEvent'
import { InitMapEvent } from '../event/initMapEvent'
import { RequestChangeMapDataMessage, ResponseChangeMapDataMessage } from '../message/changeMapMessage'
import { PriorMapDataMessage } from '../message/priorMapDataMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('priorMapData', PriorMapDataMessage, 'noBuffer')
    ev.messageRegister.registerMessage('requestChangeMapData', RequestChangeMapDataMessage, 'lastOnly')
    ev.messageRegister.registerMessage('responseChangeMapDataMessage', ResponseChangeMapDataMessage, 'noBuffer')
  }

  public registerMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    ev.messageListenerRegister.on('priorMapData', this.receivePriorData.bind(this))
    ev.messageListenerRegister.on('responseChangeMapDataMessage', this.responseChangeMapDataMessage.bind(this))
  }

  public receivePriorData(msg: PriorMapDataMessage): void {
    this.eventBus.post(new InitMapEvent(msg.data.mapId))
  }

  public responseChangeMapDataMessage(msg: ResponseChangeMapDataMessage): void {
    this.eventBus.post(new DidChangeMapEvent(msg.data.mapId))
  }
}
