import {
  BaseSocketController,
  type RegisterMessageEvent,
  type RegisterMessageListenerEvent,
} from '@churaverse/network-plugin-client'
import { OwnPlayerUndefinedError } from '@churaverse/player-plugin-client'
import { type IEventBus, type IMainScene, type Store, uniqueId } from 'churaverse-engine-client'
import { AddTextChatEvent } from '../event/addTextChatEvent'
import { SendTextChatMessage } from '../message/sendTextChatMessage'
import { TextChat } from '../model/textChat'
import '@churaverse/player-plugin-client'

export class SocketController extends BaseSocketController<IMainScene> {
  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('sendTextChatMessage', SendTextChatMessage, 'queue')
  }

  public registerMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    ev.messageListenerRegister.on('sendTextChatMessage', this.addTextChat.bind(this))
  }

  public addTextChat(msg: SendTextChatMessage): void {
    const textChatInfo = msg.data
    const playerId = textChatInfo.playerId
    const player = this.store.of('playerPlugin').players.get(playerId)
    if (player === undefined) throw new OwnPlayerUndefinedError()
    const textChat = new TextChat(uniqueId(), playerId, player.name, textChatInfo.message)
    const addTextChatEvent = new AddTextChatEvent(textChat)

    this.eventBus.post(addTextChatEvent)
  }
}
