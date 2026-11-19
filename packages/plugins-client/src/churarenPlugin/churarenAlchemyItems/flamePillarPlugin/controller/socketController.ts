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
import { FlamePillar } from '../domain/flamePillar'
import { FlamePillarDamageCause } from '../domain/flamePillarDamageCause'
import { FlamePillarHitMessage } from '../message/flamePillarHitMessage'
import { FlamePillarSpawnMessage } from '../message/flamePillarSpawnMessage'
import type { FlamePillarPluginStore } from '../store/defFlamePillarPluginStore'

export class SocketController extends BaseSocketController<IMainScene> {
  private flamePillarPluginStore!: FlamePillarPluginStore
  private bossPluginStore!: BossPluginStore
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('flamePillarSpawn', FlamePillarSpawnMessage, 'queue')
    ev.messageRegister.registerMessage('flamePillarHit', FlamePillarHitMessage, 'queue')
  }

  public setupRegisterMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('flamePillarSpawn', this.flamePillarSpawn)
    this.messageListenerRegister.on('flamePillarHit', this.flamePillarHit)
    this.messageListenerRegister.on('churarenDamage', this.flamePillarDamage)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('flamePillarSpawn', this.flamePillarSpawn)
    this.messageListenerRegister.off('flamePillarHit', this.flamePillarHit)
    this.messageListenerRegister.off('churarenDamage', this.flamePillarDamage)
  }

  public getStores(): void {
    this.flamePillarPluginStore = this.store.of('churarenFlamePillarPlugin')
    this.bossPluginStore = this.store.of('bossPlugin')
  }

  private readonly flamePillarSpawn = (msg: FlamePillarSpawnMessage, senderId: string): void => {
    const data = msg.data
    const position = new Position(data.startPos.x, data.startPos.y)
    const flamePillar = new FlamePillar(data.flamePillarId, senderId, position, data.direction, data.spawnTime)
    const flamePillarSpawnEvent = new EntitySpawnEvent(flamePillar)
    this.eventBus.post(flamePillarSpawnEvent)
  }

  private readonly flamePillarHit = (msg: FlamePillarHitMessage): void => {
    const data = msg.data
    const flamePillar = this.flamePillarPluginStore.flamePillars.get(data.flamePillarId)
    if (flamePillar === undefined) return
    const flamePillarDespawnEvent = new EntityDespawnEvent(flamePillar)
    this.eventBus.post(flamePillarDespawnEvent)
  }

  private readonly flamePillarDamage = (msg: ChurarenDamageMessage): void => {
    const data = msg.data
    if (data.cause !== 'flamePillar') return
    const target = this.bossPluginStore.bosses.get(data.targetId)
    const flamePillar = this.flamePillarPluginStore.flamePillars.get(data.sourceId)
    if (target === undefined || flamePillar === undefined) return
    const flamePillarDamageCause = new FlamePillarDamageCause(flamePillar)
    const livingDamageEvent = new LivingDamageEvent(target, flamePillarDamageCause, data.amount)
    this.eventBus.post(livingDamageEvent)
  }
}
