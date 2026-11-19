import { BaseSocketController, type RegisterMessageEvent } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'
import { SendTextChatMessage } from '../message/sendTextChatMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('sendTextChatMessage', SendTextChatMessage, 'allClients')
  }
}
