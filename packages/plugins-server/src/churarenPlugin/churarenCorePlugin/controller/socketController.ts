import type { RegisterMessageEvent } from '@churaverse/network-plugin-server'
import { BaseSocketController } from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'
import { ChurarenResultMessage } from '../message/churarenResultMessage'
import { ChurarenStartCountdownMessage } from '../message/churarenStartCountdownMessage'
import { ChurarenStartTimerMessage } from '../message/churarenStartTimerMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('churarenStartCountdown', ChurarenStartCountdownMessage, 'allClients')
    ev.messageRegister.registerMessage('churarenStartTimer', ChurarenStartTimerMessage, 'allClients')
    ev.messageRegister.registerMessage('churarenResult', ChurarenResultMessage, 'allClients')
  }
}
