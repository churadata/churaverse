import { OwnPlayerExitEvent } from '@churaverse/core-ui-plugin-client'
import type { NetworkPluginStore } from '@churaverse/network-plugin-client'
import type { PlayerPluginStore } from '@churaverse/player-plugin-client'
import { BasePlugin, type IMainScene, type InitEvent, type StartEvent } from 'churaverse-engine-client'
import { SocketController } from './controller/socketController'
import type { RequestKickPlayerEvent } from './event/requestKickPlayerEvent'
import { RequestKickPlayerMessage } from './message/requestKickPlayerMessage'
import { KickPluginUi } from './ui/kickPluginUi'

export class KickPlugin extends BasePlugin<IMainScene> {
  private playerPluginStore!: PlayerPluginStore
  private networkStore!: NetworkPluginStore<IMainScene>

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('start', this.start.bind(this))

    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
    this.bus.subscribeEvent('registerMessageListener', socketController.registerMessageListener.bind(socketController))

    this.bus.subscribeEvent('requestKickPlayer', this.handleKickPlayer.bind(this))
  }

  private init(_ev: InitEvent): void {
    this.playerPluginStore = this.store.of('playerPlugin')
    this.networkStore = this.store.of('networkPlugin')
  }

  private start(_ev: StartEvent): void {
    void new KickPluginUi(this.bus, this.store)
  }

  private handleKickPlayer(ev: RequestKickPlayerEvent): void {
    if (ev.kicked.id === this.playerPluginStore.ownPlayerId) {
      this.handleKickedOwnPlayer(ev)
    } else if (ev.kicker.id === this.playerPluginStore.ownPlayerId) {
      this.handleKickerOwnPlayer(ev)
    }
  }

  /**
   * 自プレイヤーがキックされた時に実行する
   */
  private handleKickedOwnPlayer(ev: RequestKickPlayerEvent): void {
    window.alert(`「${ev.kicker.name}」 にキックされました`)

    // 退室ボタン押下時と同様の処理
    this.bus.post(new OwnPlayerExitEvent())
  }

  /**
   * 自プレイヤーが他プレイヤーをキックした時に実行する
   */
  private handleKickerOwnPlayer(ev: RequestKickPlayerEvent): void {
    this.networkStore.messageSender.send(
      new RequestKickPlayerMessage({ kickedId: ev.kicked.id, kickerId: ev.kicker.id })
    )
  }
}
