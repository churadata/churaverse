import type { NetworkPluginStore } from '@churaverse/network-plugin-client'
import type { PlayerNameChangeEvent } from '@churaverse/player-plugin-client'
import {
  BasePlugin,
  type IMainScene,
  type InitEvent,
  type PhaserSceneInit,
  type StartEvent,
} from 'churaverse-engine-client'
import type { Scene } from 'phaser'
import { SocketController } from './controller/socketController'
import type { AddTextChatEvent } from './event/addTextChatEvent'
import type { SendTextChatEvent } from './event/sendTextChatEvent'
import { SendTextChatMessage } from './message/sendTextChatMessage'
import { TextChat } from './model/textChat'
import type { TextChatPluginStore } from './store/defTextChatPluginStore'
import { initTextChatPluginStore } from './store/initTextChatPluginStore'
import type { ITextChatUi } from './ui/interface/ITextChatUi'
import { TextChatUi } from './ui/textChatUi'

export class TextChatPlugin extends BasePlugin<IMainScene> {
  private scene?: Scene
  private textChatPluginStore!: TextChatPluginStore
  private networkStore!: NetworkPluginStore<IMainScene>
  private textChatUi!: ITextChatUi

  public listenEvent(): void {
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('start', this.start.bind(this))

    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
    this.bus.subscribeEvent('registerMessageListener', socketController.registerMessageListener.bind(socketController))

    this.bus.subscribeEvent('addTextChat', this.onAddTextChat.bind(this))
    this.bus.subscribeEvent('sendTextChat', this.sendChat.bind(this))
    this.bus.subscribeEvent('playerNameChange', this.changePlayerName.bind(this))
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.scene = ev.scene
  }

  private init(_ev: InitEvent): void {
    initTextChatPluginStore(this.store)
    this.textChatPluginStore = this.store.of('textChatPlugin')
    this.networkStore = this.store.of('networkPlugin')
  }

  private start(_ev: StartEvent): void {
    if (this.scene === undefined) return
    this.textChatUi = new TextChatUi(this.store, this.bus)
  }

  private onAddTextChat(ev: AddTextChatEvent): void {
    if (!(ev.textChat instanceof TextChat)) return

    this.textChatPluginStore.textChatService.addChat(ev.textChat)
    this.textChatUi.textChatBoard.add(ev.textChat)
    if (!this.textChatUi.textChatDialog.isOpen) {
      this.textChatPluginStore.unreadCount++
      this.textChatUi.textChatIcon.badge.activate()

      this.textChatUi.textChatToast.show(ev.textChat)
    }
  }

  private changePlayerName(ev: PlayerNameChangeEvent): void {
    const id = ev.id
    const name = ev.name
    this.textChatPluginStore.textChatService.changePlayerName(id, name)
    const textChats = this.textChatPluginStore.textChatService.textChats
    this.textChatUi.textChatBoard.redraw(textChats)
  }

  /**
   * メッセージを送信する。
   * 空文字のときには送信できない。
   */
  private sendChat(ev: SendTextChatEvent): void {
    const data = {
      playerId: ev.textChat.playerId,
      message: ev.textChat.message,
      textcolor: '',
    }

    if (data.message !== '') {
      this.networkStore.messageSender.send(new SendTextChatMessage(data))
    }
  }
}
