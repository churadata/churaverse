import type { BossPluginStore } from '@churaverse/churaren-boss-plugin-client'
import type { ChurarenDamageMessage } from '@churaverse/churaren-player-plugin-client'
import type {
  IMessageListenerRegister,
  RegisterMessageEvent,
  RegisterMessageListenerEvent,
} from '@churaverse/network-plugin-client'
import { BaseSocketController } from '@churaverse/network-plugin-client'
import {
  EntityDespawnEvent,
  EntitySpawnEvent,
  type IEventBus,
  type IMainScene,
  LivingDamageEvent,
  Position,
  type Store,
} from 'churaverse-engine-client'
import { Tornado } from '../domain/tornado'
import { TornadoDamageCause } from '../domain/tornadoDamageCause'
import { TornadoHitMessage } from '../message/tornadoHitMessage'
import { TornadoSpawnMessage } from '../message/tornadoSpawnMessage'
import type { TornadoPluginStore } from '../store/defTornadoPluginStore'

export class SocketController extends BaseSocketController<IMainScene> {
  private tornadoPluginStore!: TornadoPluginStore
  private bossPluginStore!: BossPluginStore
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('tornadoSpawn', TornadoSpawnMessage, 'queue')
    ev.messageRegister.registerMessage('tornadoHit', TornadoHitMessage, 'queue')
  }

  public setupRegisterMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('tornadoSpawn', this.tornadoSpawn)
    this.messageListenerRegister.on('tornadoHit', this.tornadoHit)
    this.messageListenerRegister.on('churarenDamage', this.tornadoDamage)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('tornadoSpawn', this.tornadoSpawn)
    this.messageListenerRegister.off('tornadoHit', this.tornadoHit)
    this.messageListenerRegister.off('churarenDamage', this.tornadoDamage)
  }

  public getStores(): void {
    this.tornadoPluginStore = this.store.of('churarenTornadoPlugin')
    this.bossPluginStore = this.store.of('bossPlugin')
  }

  private readonly tornadoSpawn = (msg: TornadoSpawnMessage, senderId: string): void => {
    const data = msg.data
    const pos = new Position(data.startPos.x, data.startPos.y)
    const tornado = new Tornado(data.tornadoId, senderId, pos, data.direction, data.spawnTime)
    const tornadoSpawnEvent = new EntitySpawnEvent(tornado)
    this.eventBus.post(tornadoSpawnEvent)
  }

  private readonly tornadoHit = (msg: TornadoHitMessage): void => {
    const data = msg.data
    const tornado = this.tornadoPluginStore.tornados.get(data.tornadoId)
    if (tornado === undefined) return
    const tornadoDespawnEvent = new EntityDespawnEvent(tornado)
    this.eventBus.post(tornadoDespawnEvent)
  }

  private readonly tornadoDamage = (msg: ChurarenDamageMessage): void => {
    const data = msg.data
    if (data.cause !== 'tornado') return
    const target = this.bossPluginStore.bosses.get(data.targetId)
    const tornado = this.tornadoPluginStore.tornados.get(data.sourceId)
    if (target === undefined || tornado === undefined) return
    const tornadoDamageCause = new TornadoDamageCause(tornado)
    const livingDamageEvent = new LivingDamageEvent(target, tornadoDamageCause, data.amount)
    this.eventBus.post(livingDamageEvent)
  }
}
