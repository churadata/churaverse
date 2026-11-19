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
import { Explosion } from '../domain/explosion'
import { ExplosionDamageCause } from '../domain/explosionDamageCause'
import { ExplosionHitMessage } from '../message/explosionHitMessage'
import { ExplosionSpawnMessage } from '../message/explosionSpawnMessage'
import type { ExplosionPluginStore } from '../store/defExplosionPluginStore'

export class SocketController extends BaseSocketController<IMainScene> {
  private explosionPluginStore!: ExplosionPluginStore
  private bossPluginStore!: BossPluginStore
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('explosionSpawn', ExplosionSpawnMessage, 'queue')
    ev.messageRegister.registerMessage('explosionHit', ExplosionHitMessage, 'queue')
  }

  public setupRegisterMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('explosionSpawn', this.explosionSpawn)
    this.messageListenerRegister.on('explosionHit', this.explosionHit)
    this.messageListenerRegister.on('churarenDamage', this.explosionDamage)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('explosionSpawn', this.explosionSpawn)
    this.messageListenerRegister.off('explosionHit', this.explosionHit)
    this.messageListenerRegister.off('churarenDamage', this.explosionDamage)
  }

  public getStores(): void {
    this.explosionPluginStore = this.store.of('churarenExplosionPlugin')
    this.bossPluginStore = this.store.of('bossPlugin')
  }

  private readonly explosionSpawn = (msg: ExplosionSpawnMessage, senderId: string): void => {
    const data = msg.data
    const pos = new Position(data.startPos.x, data.startPos.y)
    const explosion = new Explosion(data.explosionId, senderId, pos, data.direction, data.spawnTime)
    const explosionSpawnEvent = new EntitySpawnEvent(explosion)
    this.eventBus.post(explosionSpawnEvent)
  }

  private readonly explosionHit = (msg: ExplosionHitMessage): void => {
    const data = msg.data
    const explosion = this.explosionPluginStore.explosions.get(data.explosionId)
    if (explosion === undefined) return
    const explosionDespawnEvent = new EntityDespawnEvent(explosion)
    this.eventBus.post(explosionDespawnEvent)
  }

  private readonly explosionDamage = (msg: ChurarenDamageMessage): void => {
    const data = msg.data
    if (data.cause !== 'explosion') return
    const target = this.bossPluginStore.bosses.get(data.targetId)
    const explosion = this.explosionPluginStore.explosions.get(data.sourceId)
    if (target === undefined || explosion === undefined) return
    const explosionDamageCause = new ExplosionDamageCause(explosion)
    const livingDamageEvent = new LivingDamageEvent(target, explosionDamageCause, data.amount)
    this.eventBus.post(livingDamageEvent)
  }
}
