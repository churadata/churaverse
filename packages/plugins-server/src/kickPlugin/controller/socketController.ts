import { BaseSocketController, type RegisterMessageEvent } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'
import { RequestKickPlayerMessage } from '../message/requestKickPlayerMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('requestKickPlayer', RequestKickPlayerMessage, 'others')
  }
}
