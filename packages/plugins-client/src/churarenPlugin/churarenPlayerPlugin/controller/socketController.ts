import type {
  IMessageListenerRegister,
  RegisterMessageEvent,
  RegisterMessageListenerEvent,
} from '@churaverse/network-plugin-client'
import { BaseSocketController } from '@churaverse/network-plugin-client'
import type { PlayerPluginStore } from '@churaverse/player-plugin-client'
import type { IEventBus, IMainScene, Store } from 'churaverse-engine-client'
import { DropChurarenItemEvent } from '../event/dropChurarenItemEvent'
import { GetChurarenItemEvent } from '../event/getChurarenItemEvent'
import { GhostModeEvent } from '../event/ghostModeEvent'
import { InvicibleTimeEvent } from '../event/invicibleTimeEvent'
import { ChurarenDamageMessage } from '../message/churarenDamageMessage'
import { DropChurarenItemMessage } from '../message/dropChurarenItemMessage'
import { GetChurarenItemMessage } from '../message/getChurarenItemMessage'
import { GhostModeMessage } from '../message/ghostModeMessage'
import { InvicibleTimeMessage } from '../message/invicibleTimeMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  private playerPluginStore!: PlayerPluginStore
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('invicibleTime', InvicibleTimeMessage, 'queue')
    ev.messageRegister.registerMessage('getChurarenItem', GetChurarenItemMessage, 'queue')
    ev.messageRegister.registerMessage('dropChurarenItem', DropChurarenItemMessage, 'queue')
    ev.messageRegister.registerMessage('ghostMode', GhostModeMessage, 'queue')
    ev.messageRegister.registerMessage('churarenDamage', ChurarenDamageMessage, 'queue')
  }

  public setupMessageListenerRegister(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
    this.playerPluginStore = this.store.of('playerPlugin')
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('invicibleTime', this.onInvicibleTime)
    this.messageListenerRegister.on('getChurarenItem', this.getItem)
    this.messageListenerRegister.on('dropChurarenItem', this.dropItem)
    this.messageListenerRegister.on('ghostMode', this.ghostMode)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('invicibleTime', this.onInvicibleTime)
    this.messageListenerRegister.off('getChurarenItem', this.getItem)
    this.messageListenerRegister.off('dropChurarenItem', this.dropItem)
    this.messageListenerRegister.off('ghostMode', this.ghostMode)
  }

  private readonly onInvicibleTime = (msg: InvicibleTimeMessage): void => {
    const data = msg.data
    const invicibleTimeEvent = new InvicibleTimeEvent(data.playerId, data.invicibleTime)
    this.eventBus.post(invicibleTimeEvent)
  }

  private readonly getItem = (msg: GetChurarenItemMessage): void => {
    const data = msg.data
    const getItemEvent = new GetChurarenItemEvent(data.playerId, data.itemId)
    this.eventBus.post(getItemEvent)
  }

  private readonly dropItem = (msg: DropChurarenItemMessage): void => {
    const data = msg.data
    const dropItemEvent = new DropChurarenItemEvent(data.playerId, data.itemId)
    this.eventBus.post(dropItemEvent)
  }

  private readonly ghostMode = (msg: GhostModeMessage): void => {
    const data = msg.data
    const player = this.playerPluginStore.players.get(data.playerId)
    if (player === undefined) return
    const ghostModeEvent = new GhostModeEvent(player.id)
    this.eventBus.post(ghostModeEvent)
  }
}
