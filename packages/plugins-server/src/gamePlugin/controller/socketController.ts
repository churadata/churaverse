import {
  BaseSocketController,
  type PriorDataRequestMessage,
  type RegisterMessageEvent,
  type RegisterMessageListenerEvent,
} from '@churaverse/network-plugin-server'
import type { IMainScene } from 'churaverse-engine-server'
import { GameAbortEvent } from '../event/gameAbortEvent'
import { GameEndEvent } from '../event/gameEndEvent'
import { GameHostEvent } from '../event/gameHostEvent'
import { GameMidwayJoinEvent } from '../event/gameMidwayJoinEvent'
import { GamePlayerQuitEvent } from '../event/gamePlayerQuitEvent'
import { PriorGameDataEvent } from '../event/priorGameDataEvent'
import { SubmitGameJoinEvent } from '../event/submitGameJoinEvent'
import { RequestGameAbortMessage, ResponseGameAbortMessage } from '../message/gameAbortMessage'
import { RequestGameEndMessage, ResponseGameEndMessage } from '../message/gameEndMessage'
import { RequestGameHostMessage, ResponseGameHostMessage } from '../message/gameHostMessage'
import { RequestGameMidwayJoinMessage, ResponseGameMidwayJoinMessage } from '../message/gameMidwayJoinMessage'
import { GamePlayerQuitMessage } from '../message/gamePlayerQuitMessage'
import { GameStartMessage } from '../message/gameStartMessage'
import { PriorGameDataMessage } from '../message/priorGameDataMessage'
import { SubmitGameJoinMessage } from '../message/submitGameJoinMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('priorGameData', PriorGameDataMessage, 'onlySelf')
    ev.messageRegister.registerMessage('requestGameHost', RequestGameHostMessage, 'onlyServer')
    ev.messageRegister.registerMessage('responseGameHost', ResponseGameHostMessage, 'allClients')
    ev.messageRegister.registerMessage('submitGameJoin', SubmitGameJoinMessage, 'onlyServer')
    ev.messageRegister.registerMessage('gameStart', GameStartMessage, 'allClients')
    ev.messageRegister.registerMessage('requestGameEnd', RequestGameEndMessage, 'onlySelf')
    ev.messageRegister.registerMessage('responseGameEnd', ResponseGameEndMessage, 'allClients')
    ev.messageRegister.registerMessage('requestGameAbort', RequestGameAbortMessage, 'onlySelf')
    ev.messageRegister.registerMessage('responseGameAbort', ResponseGameAbortMessage, 'allClients')
    ev.messageRegister.registerMessage('gamePlayerQuit', GamePlayerQuitMessage, 'onlySelf')
    ev.messageRegister.registerMessage('requestGameMidwayJoin', RequestGameMidwayJoinMessage, 'onlyServer')
    ev.messageRegister.registerMessage('responseGameMidwayJoin', ResponseGameMidwayJoinMessage, 'onlySelf')
  }

  public registerMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    ev.messageListenerRegister.on('requestPriorData', this.sendPriorGameData.bind(this))
    ev.messageListenerRegister.on('requestGameHost', this.gameHost.bind(this))
    ev.messageListenerRegister.on('submitGameJoin', this.submitGameJoin.bind(this))
    ev.messageListenerRegister.on('requestGameEnd', this.gameEnd.bind(this))
    ev.messageListenerRegister.on('requestGameAbort', this.gameAbort.bind(this))
    ev.messageListenerRegister.on('gamePlayerQuit', this.gamePlayerQuit.bind(this))
    ev.messageListenerRegister.on('requestGameMidwayJoin', this.gameMidwayJoin.bind(this))
  }

  /**
   * 途中参加のプレイヤーに進行中のゲームを通知する
   * イベントを発火し、それぞれのゲームプラグインで処理を行う
   */
  private sendPriorGameData(_msg: PriorDataRequestMessage, senderId: string): void {
    this.eventBus.post(new PriorGameDataEvent(senderId))
  }

  private gameHost(msg: RequestGameHostMessage): void {
    this.eventBus.post(new GameHostEvent(msg.data.gameId, msg.data.ownerId))
  }

  private submitGameJoin(msg: SubmitGameJoinMessage, senderId: string): void {
    this.eventBus.post(new SubmitGameJoinEvent(msg.data.gameId, senderId, msg.data.willJoin))
  }

  private gameAbort(msg: RequestGameAbortMessage): void {
    this.eventBus.post(new GameAbortEvent(msg.data.gameId, msg.data.playerId))
  }

  private gameEnd(msg: RequestGameEndMessage): void {
    this.eventBus.post(new GameEndEvent(msg.data.gameId))
  }

  private gamePlayerQuit(msg: GamePlayerQuitMessage): void {
    this.eventBus.post(new GamePlayerQuitEvent(msg.data.gameId, msg.data.playerId))
  }

  private gameMidwayJoin(msg: RequestGameMidwayJoinMessage, senderId: string): void {
    this.eventBus.post(new GameMidwayJoinEvent(msg.data.gameId, senderId))
  }
}
