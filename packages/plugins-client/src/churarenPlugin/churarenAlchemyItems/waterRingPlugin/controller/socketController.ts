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
import { WaterRing } from '../domain/waterRing'
import { WaterRingDamageCause } from '../domain/waterRingDamageCause'
import { WaterRingDespawnMessage } from '../message/waterRingDespawnMessage'
import { WaterRingSpawnMessage } from '../message/waterRingSpawnMessage'
import type { WaterRingPluginStore } from '../store/defWaterRingPluginStore'

export class SocketController extends BaseSocketController<IMainScene> {
  private waterRingPluginStore!: WaterRingPluginStore
  private bossPluginStore!: BossPluginStore
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('waterRingSpawn', WaterRingSpawnMessage, 'queue')
    ev.messageRegister.registerMessage('waterRingDespawn', WaterRingDespawnMessage, 'queue')
  }

  public setupRegisterMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('waterRingSpawn', this.waterRingSpawn)
    this.messageListenerRegister.on('waterRingDespawn', this.waterRingDespawn)
    this.messageListenerRegister.on('churarenDamage', this.waterRingDamage)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('waterRingSpawn', this.waterRingSpawn)
    this.messageListenerRegister.off('waterRingDespawn', this.waterRingDespawn)
    this.messageListenerRegister.off('churarenDamage', this.waterRingDamage)
  }

  public getStores(): void {
    this.waterRingPluginStore = this.store.of('churarenWaterRingPlugin')
    this.bossPluginStore = this.store.of('bossPlugin')
  }

  private readonly waterRingSpawn = (msg: WaterRingSpawnMessage, senderId: string): void => {
    const data = msg.data
    const pos = new Position(data.startPos.x, data.startPos.y)
    const waterRing = new WaterRing(data.waterRingId, senderId, pos, data.direction, data.spawnTime)
    const waterRingSpawnEvent = new EntitySpawnEvent(waterRing)
    this.eventBus.post(waterRingSpawnEvent)
  }

  private readonly waterRingDespawn = (msg: WaterRingDespawnMessage): void => {
    const data = msg.data
    const waterRing = this.waterRingPluginStore.waterRings.get(data.waterRingId)
    if (waterRing === undefined) return
    const waterRingDespawnEvent = new EntityDespawnEvent(waterRing)
    this.eventBus.post(waterRingDespawnEvent)
  }

  private readonly waterRingDamage = (msg: ChurarenDamageMessage): void => {
    const data = msg.data
    if (data.cause !== 'waterRing') return
    const target = this.bossPluginStore.bosses.get(data.targetId)
    const waterRing = this.waterRingPluginStore.waterRings.get(data.sourceId)
    const attacker = waterRing?.churarenWeaponOwnerId
    if (target === undefined || waterRing === undefined || attacker === undefined) return
    const waterRingDamageCause = new WaterRingDamageCause(waterRing)
    const livingDamageEvent = new LivingDamageEvent(target, waterRingDamageCause, data.amount)
    this.eventBus.post(livingDamageEvent)
  }
}
