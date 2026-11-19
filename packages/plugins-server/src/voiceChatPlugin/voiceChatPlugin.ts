import { Player } from '@churaverse/player-plugin-server'
import { BasePlugin, type EntityDespawnEvent, type EntitySpawnEvent, type IMainScene } from 'churaverse-engine-server'
import { SocketController } from './controller/socketController'
import type { ToggleMegaphoneEvent } from './event/toggleMegaphoneEvent'
import type { ToggleMicEvent } from './event/toggleMicEvent'
import type { VoiceChatPluginStore } from './store/defVoiceChatPluginStore'
import { initVoiceChatPluginStore } from './store/initVoiceChatPluginStore'

export class VoiceChatPlugin extends BasePlugin<IMainScene> {
  private voiceChatStore!: VoiceChatPluginStore

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))

    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
    this.bus.subscribeEvent('registerMessageListener', socketController.registerMessageListener.bind(socketController))

    this.bus.subscribeEvent('entitySpawn', this.initPlayersMic.bind(this))
    this.bus.subscribeEvent('entitySpawn', this.initPlayersMegaphone.bind(this))
    this.bus.subscribeEvent('entityDespawn', this.deletePlayersMic.bind(this))
    this.bus.subscribeEvent('entityDespawn', this.deletePlayersMegaphone.bind(this))
    this.bus.subscribeEvent('toggleMic', this.toggleMic.bind(this))
    this.bus.subscribeEvent('toggleMegaphone', this.toggleMegaphone.bind(this))
  }

  private init(): void {
    initVoiceChatPluginStore(this.store)
    this.getStores()
  }

  private getStores(): void {
    this.voiceChatStore = this.store.of('voiceChatPlugin')
  }

  private initPlayersMic(ev: EntitySpawnEvent): void {
    if (!(ev.entity instanceof Player)) return
    this.voiceChatStore.playersMic.set(ev.entity.id, false)
  }

  private initPlayersMegaphone(ev: EntitySpawnEvent): void {
    if (!(ev.entity instanceof Player)) return
    this.voiceChatStore.playersMegaphone.set(ev.entity.id, true)
  }

  private deletePlayersMic(ev: EntityDespawnEvent): void {
    if (!(ev.entity instanceof Player)) return
    this.voiceChatStore.playersMic.delete(ev.entity.id)
  }

  private deletePlayersMegaphone(ev: EntityDespawnEvent): void {
    if (!(ev.entity instanceof Player)) return
    this.voiceChatStore.playersMegaphone.delete(ev.entity.id)
  }

  private toggleMic(ev: ToggleMicEvent): void {
    this.voiceChatStore.playersMic.set(ev.playerId, ev.isUnmute)
  }

  private toggleMegaphone(ev: ToggleMegaphoneEvent): void {
    this.voiceChatStore.playersMegaphone.set(ev.playerId, ev.active)
  }
}
