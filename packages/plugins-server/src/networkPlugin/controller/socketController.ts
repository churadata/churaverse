import { type Scenes, SceneTransitionEvent } from 'churaverse-engine-server'
import type { RegisterMessageEvent } from '../event/registerMessageEvent'
import type { RegisterMessageListenerEvent } from '../event/registerMessageListenerEvent'
import { BaseSocketController } from '../interface/baseSocketController'
import { PriorDataRequestMessage } from '../message/priorDataMessage'
import { SceneTransitionMessage } from '../message/sceneTransitionMessage'

export class SocketController extends BaseSocketController<Scenes> {
  public registerMessage(ev: RegisterMessageEvent<Scenes>): void {
    ev.messageRegister.registerMessage('requestPriorData', PriorDataRequestMessage, 'onlyServer')
    ev.messageRegister.registerMessage('sceneTransition', SceneTransitionMessage, 'onlyServer')
  }

  public registerMessageListener(ev: RegisterMessageListenerEvent<Scenes>): void {
    ev.messageListenerRegister.on('sceneTransition', this.sceneTransition.bind(this))
  }

  private sceneTransition(msg: SceneTransitionMessage, senderId: string): void {
    this.eventBus.post(new SceneTransitionEvent(msg.data.sceneName, senderId))
  }
}
