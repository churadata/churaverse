import type {
  IMessageListenerRegister,
  RegisterMessageEvent,
  RegisterMessageListenerEvent,
} from '@churaverse/network-plugin-client'
import { BaseSocketController } from '@churaverse/network-plugin-client'
import type { IEventBus, IMainScene, Store } from 'churaverse-engine-client'
import { ChurarenResultEvent } from '../event/churarenResultEvent'
import { ChurarenStartCountdownEvent } from '../event/churarenStartCountdownEvent'
import { ChurarenStartTimerEvent } from '../event/churarenStartTimer'
import { ChurarenResultMessage } from '../message/churarenResultMessage'
import { ChurarenStartCountdownMessage } from '../message/churarenStartCountdownMessage'
import { ChurarenStartTimerMessage } from '../message/churarenStartTimerMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('churarenStartCountdown', ChurarenStartCountdownMessage, 'queue')
    ev.messageRegister.registerMessage('churarenStartTimer', ChurarenStartTimerMessage, 'queue')
    ev.messageRegister.registerMessage('churarenResult', ChurarenResultMessage, 'queue')
  }

  public setupMessageListenerRegister(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('churarenStartCountdown', this.churarenStartCountdown)
    this.messageListenerRegister.on('churarenStartTimer', this.churarenStartTimer)
    this.messageListenerRegister.on('churarenResult', this.churarenResult)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('churarenStartCountdown', this.churarenStartCountdown)
    this.messageListenerRegister.off('churarenStartTimer', this.churarenStartTimer)
    this.messageListenerRegister.off('churarenResult', this.churarenResult)
  }

  private readonly churarenStartCountdown = (): void => {
    this.eventBus.post(new ChurarenStartCountdownEvent())
  }

  private readonly churarenStartTimer = (): void => {
    this.eventBus.post(new ChurarenStartTimerEvent())
  }

  private readonly churarenResult = (msg: ChurarenResultMessage): void => {
    this.eventBus.post(new ChurarenResultEvent(msg.data.resultType))
  }
}
