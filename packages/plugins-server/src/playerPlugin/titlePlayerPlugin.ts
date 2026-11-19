import {
  BaseSocketController,
  type NetworkPluginStore,
  type PriorDataRequestMessage,
  type RegisterMessageEvent,
  type RegisterMessageListenerEvent,
  type SendableObject,
} from '@churaverse/network-plugin-server'
import { BasePlugin, type ITitleScene } from 'churaverse-engine-server'
import { TitleParticipantUpdateMessage } from './message/titleParticipantUpdate'
import { TitlePriorPlayerDataMessage } from './message/titlePriorPlayerDataMessage'
import { eventEmitter, playerNameColorCache } from './playerNameColorCache'

class SocketController extends BaseSocketController<ITitleScene> {
  public registerMessage(ev: RegisterMessageEvent<ITitleScene>): void {
    // onlySelf: リクエストしてきたクライアントにのみ返す
    ev.messageRegister.registerMessage('titlePriorPlayerData', TitlePriorPlayerDataMessage, 'onlySelf')
    ev.messageRegister.registerMessage('titleParticipantUpdate', TitleParticipantUpdateMessage, 'allClients')
  }

  public registerMessageListener(ev: RegisterMessageListenerEvent<ITitleScene>): void {
    ev.messageListenerRegister.on('requestPriorData', this.sendTitlePriorPlayerData.bind(this))
  }

  private sendTitlePriorPlayerData(_msg: PriorDataRequestMessage, senderId: string): void {
    const players = playerNameColorCache.getAll()
    const { messageSender } = this.store.of('networkPlugin') as NetworkPluginStore<ITitleScene>
    messageSender.send(new TitlePriorPlayerDataMessage({ players } as unknown as SendableObject), senderId)
  }
}

export class TitlePlayerPlugin extends BasePlugin<ITitleScene> {
  public listenEvent(): void {
    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
    this.bus.subscribeEvent('registerMessageListener', socketController.registerMessageListener.bind(socketController))
    eventEmitter.on('titleParticipantUpdate', this.sendTitleParticipantUpdate.bind(this))
  }

  private sendTitleParticipantUpdate(): void {
    const players = playerNameColorCache.getAll()
    const { messageSender } = this.store.of('networkPlugin') as NetworkPluginStore<ITitleScene>
    messageSender.send(new TitleParticipantUpdateMessage({ players } as unknown as SendableObject))
  }
}
