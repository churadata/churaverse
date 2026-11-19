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
import { Boss } from '../domain/boss'
import { CollisionBossDamageCause } from '../domain/collisionBossDamageCause'
import { BossWalkEvent } from '../event/bossWalkEvent'
import { BossDespawnMessage } from '../message/bossDespawnMessage'
import { BossSpawnMessage } from '../message/bossSpawnMessage'
import { BossWalkMessage } from '../message/bossWalkMessage'
import type { BossPluginStore } from '../store/defBossPluginStore'

export class SocketController extends BaseSocketController<IMainScene> {
  public bossPluginStore!: BossPluginStore
  public messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('bossSpawn', BossSpawnMessage, 'queue')
    ev.messageRegister.registerMessage('bossDespawn', BossDespawnMessage, 'queue')
    ev.messageRegister.registerMessage('bossWalk', BossWalkMessage, 'queue')
  }

  public setupMessageListenerRegister(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public getStore(): void {
    this.bossPluginStore = this.store.of('bossPlugin')
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('bossSpawn', this.bossSpawn)
    this.messageListenerRegister.on('bossDespawn', this.bossDespawn)
    this.messageListenerRegister.on('churarenDamage', this.collisionBossDamage)
    this.messageListenerRegister.on('bossWalk', this.bossWalk)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('bossSpawn', this.bossSpawn)
    this.messageListenerRegister.off('bossDespawn', this.bossDespawn)
    this.messageListenerRegister.off('churarenDamage', this.collisionBossDamage)
    this.messageListenerRegister.off('bossWalk', this.bossWalk)
  }

  private readonly bossSpawn = (msg: BossSpawnMessage): void => {
    const data = msg.data
    if (this.bossPluginStore.bosses.get(data.bossId) !== undefined) return
    const pos = new Position(data.startPos.x, data.startPos.y)
    const boss = new Boss(data.bossId, pos, data.spawnTime, data.bossHp)
    const bossSpawnEvent = new EntitySpawnEvent(boss)
    this.eventBus.post(bossSpawnEvent)
  }

  private readonly bossDespawn = (msg: BossDespawnMessage): void => {
    const data = msg.data
    const boss = this.bossPluginStore.bosses.get(data.bossId)
    if (boss === undefined) return
    const bossDespawnEvent = new EntityDespawnEvent(boss)
    this.eventBus.post(bossDespawnEvent)
  }

  private readonly collisionBossDamage = (msg: ChurarenDamageMessage): void => {
    const data = msg.data
    if (data.cause !== 'collisionBoss') return
    const target = this.store.of('playerPlugin').players.get(data.targetId)
    const boss = this.bossPluginStore.bosses.get(data.sourceId)
    const attacker = boss?.bossId
    if (target === undefined || boss === undefined || attacker === undefined) return
    const collisionBossDamageCause = new CollisionBossDamageCause(boss)
    const livingDamageEvent = new LivingDamageEvent(target, collisionBossDamageCause, data.amount)
    this.eventBus.post(livingDamageEvent)
  }

  private readonly bossWalk = (msg: BossWalkMessage): void => {
    const data = msg.data
    const position = new Position(data.startPos.x, data.startPos.y)
    const dest = new Position(data.dest.x, data.dest.y)
    const bossWalkEvent = new BossWalkEvent(data.bossId, data.direction, position, dest, data.speed)
    this.eventBus.post(bossWalkEvent)
  }
}
