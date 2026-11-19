import type { Scenes } from 'churaverse-engine-client'
import type { RegisterMessageEvent } from '../event/registerMessageEvent'
import { BaseSocketController } from '../interface/baseSocketController'
import { PriorDataRequestMessage } from '../message/priorDataMessage'
import { SceneTransitionMessage } from '../message/sceneTransitionMessage'

export class SocketController extends BaseSocketController<Scenes> {
  public registerMessage(ev: RegisterMessageEvent<Scenes>): void {
    ev.messageRegister.registerMessage('requestPriorData', PriorDataRequestMessage, 'queue')
    ev.messageRegister.registerMessage('sceneTransition', SceneTransitionMessage, 'queue')
  }
}
