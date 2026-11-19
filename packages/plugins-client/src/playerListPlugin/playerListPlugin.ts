import type { PlayerNameChangeEvent, PlayerPluginStore } from '@churaverse/player-plugin-client'
import { isPlayer } from '@churaverse/player-plugin-client'
import { BasePlugin, EntityDespawnEvent, EntitySpawnEvent, type IMainScene } from 'churaverse-engine-client'
import { PlayerListUi } from './playerListUi'
import { initPlayerListPluginStore } from './store/initPlayerListPluginStore'

export class PlayerListPlugin extends BasePlugin<IMainScene> {
  private playerListUi!: PlayerListUi
  private playerPluginStore!: PlayerPluginStore

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('entitySpawn', this.updatePlayerList.bind(this))
    this.bus.subscribeEvent('entityDespawn', this.updatePlayerList.bind(this))
    this.bus.subscribeEvent('playerNameChange', this.updatePlayerList.bind(this))
  }

  private init(): void {
    this.playerListUi = new PlayerListUi(this.store)
    this.playerPluginStore = this.store.of('playerPlugin')
    initPlayerListPluginStore(this.bus, this.store, this.playerListUi)
  }

  private updatePlayerList(ev: PlayerNameChangeEvent | EntitySpawnEvent | EntityDespawnEvent): void {
    // PlayerのSpawn, Despawnイベントでない場合return
    if (ev instanceof EntitySpawnEvent || ev instanceof EntityDespawnEvent) {
      if (!isPlayer(ev.entity)) return
    }

    this.playerListUi.playerList.updatePlayerList(this.playerPluginStore.ownPlayerId, this.playerPluginStore.players)
  }
}
