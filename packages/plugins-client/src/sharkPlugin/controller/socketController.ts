import {
  BaseSocketController,
  type RegisterMessageEvent,
  type RegisterMessageListenerEvent,
} from '@churaverse/network-plugin-client'
import type { PlayerPluginStore, WeaponDamageMessage } from '@churaverse/player-plugin-client'
import {
  EntityDespawnEvent,
  EntitySpawnEvent,
  type IEventBus,
  type IMainScene,
  LivingDamageEvent,
  Position,
  type Store,
} from 'churaverse-engine-client'
import { Shark } from '../domain/shark'
import { SharkDamageCause } from '../domain/sharkDamageCause'
import { SharkHitMessage } from '../message/sharkHitMessage'
import { SharkSpawnMessage } from '../message/sharkSpawnMessage'
import type { SharkPluginStore } from '../store/defSharkPluginStore'

export class SocketController extends BaseSocketController<IMainScene> {
  private sharkPluginStore!: SharkPluginStore
  private playerPluginStore!: PlayerPluginStore

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
    eventBus.subscribeEvent('init', this.getStores.bind(this))
  }

  private getStores(): void {
    this.sharkPluginStore = this.store.of('sharkPlugin')
    this.playerPluginStore = this.store.of('playerPlugin')
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('sharkSpawn', SharkSpawnMessage, 'queue')
    ev.messageRegister.registerMessage('sharkHit', SharkHitMessage, 'queue')
  }

  public registerMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    ev.messageListenerRegister.on('sharkSpawn', this.sharkSpawn.bind(this))
    ev.messageListenerRegister.on('sharkHit', this.sharkHit.bind(this))
    ev.messageListenerRegister.on('weaponDamage', this.sharkDamage.bind(this))
  }

  private sharkSpawn(msg: SharkSpawnMessage, senderId: string): void {
    const data = msg.data
    const pos = new Position(data.startPos.x, data.startPos.y)
    const shark = new Shark(data.sharkId, senderId, pos, data.direction, data.spawnTime)
    const sharkSpawnEvent = new EntitySpawnEvent(shark)
    this.eventBus.post(sharkSpawnEvent)
  }

  private sharkHit(msg: SharkHitMessage): void {
    const data = msg.data
    const shark = this.sharkPluginStore.sharks.get(data.sharkId)
    if (shark === undefined) return
    const sharkDespawnEvent = new EntityDespawnEvent(shark)
    this.eventBus.post(sharkDespawnEvent)
  }

  private sharkDamage(msg: WeaponDamageMessage): void {
    const data = msg.data
    if (data.cause !== 'shark') return
    const target = this.playerPluginStore.players.get(data.targetId)
    const shark = this.sharkPluginStore.sharks.get(data.weaponId)
    const attacker = shark?.ownerId
    if (target === undefined || shark === undefined || attacker === undefined) return
    const sharkDamageCause = new SharkDamageCause(shark)
    const livingDamageEvent = new LivingDamageEvent(target, sharkDamageCause, data.amount)
    this.eventBus.post(livingDamageEvent)
  }
}
