import {
  BaseSocketController,
  type RegisterMessageEvent,
  type RegisterMessageListenerEvent,
} from '@churaverse/network-plugin-client'
import type { IEventBus, ITitleScene, Store } from 'churaverse-engine-client'
import { TitlePlayerListReceivedEvent } from '../event/titlePlayerListReceivedEvent'
import { type TitleParticipantUpdate, TitleParticipantUpdateMessage } from '../message/titleParticipantUpdateMessage'
import { type TitlePriorPlayerData, TitlePriorPlayerDataMessage } from '../message/titlePriorPlayerDataMessage'

export class SocketController extends BaseSocketController<ITitleScene> {
  public constructor(eventBus: IEventBus<ITitleScene>, store: Store<ITitleScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<ITitleScene>): void {
    ev.messageRegister.registerMessage('titlePriorPlayerData', TitlePriorPlayerDataMessage, 'noBuffer')
    ev.messageRegister.registerMessage('titleParticipantUpdate', TitleParticipantUpdateMessage, 'noBuffer')
  }

  public registerMessageListener(ev: RegisterMessageListenerEvent<ITitleScene>): void {
    ev.messageListenerRegister.on('titlePriorPlayerData', this.onTitlePriorPlayerData.bind(this))
    ev.messageListenerRegister.on('titleParticipantUpdate', this.onTitleParticipantUpdate.bind(this))
  }

  private onTitlePriorPlayerData(msg: TitlePriorPlayerDataMessage): void {
    if (msg.data === undefined) return
    const { players } = msg.data as unknown as TitlePriorPlayerData
    this.eventBus.post(new TitlePlayerListReceivedEvent(players))
  }

  private onTitleParticipantUpdate(msg: TitleParticipantUpdateMessage): void {
    if (msg.data === undefined) return
    const { players } = msg.data as unknown as TitleParticipantUpdate
    this.eventBus.post(new TitlePlayerListReceivedEvent(players))
  }
}
