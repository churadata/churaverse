import {
  BaseSocketController,
  type RegisterMessageEvent,
  type RegisterMessageListenerEvent,
} from '@churaverse/network-plugin-client'
import type { PlayerPluginStore } from '@churaverse/player-plugin-client'
import type { IEventBus, IMainScene, Store } from 'churaverse-engine-client'
import { MuteEvent } from '../event/muteEvent'
import { ToggleMegaphoneEvent } from '../event/toggleMegaphoneEvent'
import { UnmuteEvent } from '../event/unmuteEvent'
import { PriorPlayersMegaphoneMessage } from '../message/priorPlayersMegaphoneMessage'
import { PriorPlayersMicMessage } from '../message/priorPlayersMicMessage'
import { ToggleMegaphoneMessage } from '../message/toggleMegaphoneMessage'
import { ToggleMicMessage } from '../message/toggleMicMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  private playerPluginStore!: PlayerPluginStore
  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
    eventBus.subscribeEvent('init', this.getStores.bind(this))
  }

  private getStores(): void {
    this.playerPluginStore = this.store.of('playerPlugin')
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('toggleMegaphone', ToggleMegaphoneMessage, 'lastOnly')
    ev.messageRegister.registerMessage('toggleMic', ToggleMicMessage, 'lastOnly')
    ev.messageRegister.registerMessage('priorPlayersMicData', PriorPlayersMicMessage, 'noBuffer')
    ev.messageRegister.registerMessage('priorPlayersMegaphoneData', PriorPlayersMegaphoneMessage, 'noBuffer')
  }

  public registerMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    ev.messageListenerRegister.on('toggleMegaphone', this.toggleMegaphone.bind(this))
    ev.messageListenerRegister.on('priorPlayersMicData', this.receivePriorPlayersMic.bind(this))
    ev.messageListenerRegister.on('priorPlayersMegaphoneData', this.receivePriorPlayersMegaphone.bind(this))
  }

  private toggleMegaphone(msg: ToggleMegaphoneMessage): void {
    const data = msg.data
    this.eventBus.post(new ToggleMegaphoneEvent(data.playerId, data.active))
  }

  private receivePriorPlayersMic(msg: PriorPlayersMicMessage, _senderId: string): void {
    const data = msg.data
    const ownPlayerId = this.playerPluginStore.ownPlayerId
    for (const [id, isUnmute] of Object.entries(data.existPlayersMic)) {
      if (id === ownPlayerId) continue

      if (isUnmute) {
        this.eventBus.post(new UnmuteEvent(id))
      } else {
        this.eventBus.post(new MuteEvent(id))
      }
    }
  }

  private receivePriorPlayersMegaphone(msg: PriorPlayersMegaphoneMessage, _senderId: string): void {
    const data = msg.data
    const ownPlayerId = this.playerPluginStore.ownPlayerId
    for (const [id, active] of Object.entries(data.existPlayersMegaphone)) {
      if (id === ownPlayerId) continue
      this.eventBus.post(new ToggleMegaphoneEvent(id, active))
    }
  }
}
