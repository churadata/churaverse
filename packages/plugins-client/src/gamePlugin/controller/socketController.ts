import {
  BaseSocketController,
  type RegisterMessageEvent,
  type RegisterMessageListenerEvent,
} from '@churaverse/network-plugin-client'
import type { IMainScene } from 'churaverse-engine-client'
import { GameAbortEvent } from '../event/gameAbortEvent'
import { GameEndEvent } from '../event/gameEndEvent'
import { GameHostEvent } from '../event/gameHostEvent'
import { GameMidwayJoinEvent } from '../event/gameMidwayJoinEvent'
import { GameStartEvent } from '../event/gameStartEvent'
import { PriorGameDataEvent } from '../event/priorGameDataEvent'
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
    ev.messageRegister.registerMessage('priorGameData', PriorGameDataMessage, 'noBuffer')
    ev.messageRegister.registerMessage('requestGameHost', RequestGameHostMessage, 'lastOnly')
    ev.messageRegister.registerMessage('responseGameHost', ResponseGameHostMessage, 'noBuffer')
    ev.messageRegister.registerMessage('submitGameJoin', SubmitGameJoinMessage, 'queue')
    ev.messageRegister.registerMessage('gameStart', GameStartMessage, 'noBuffer')
    ev.messageRegister.registerMessage('requestGameEnd', RequestGameEndMessage, 'lastOnly')
    ev.messageRegister.registerMessage('responseGameEnd', ResponseGameEndMessage, 'noBuffer')
    ev.messageRegister.registerMessage('requestGameAbort', RequestGameAbortMessage, 'lastOnly')
    ev.messageRegister.registerMessage('responseGameAbort', ResponseGameAbortMessage, 'noBuffer')
    ev.messageRegister.registerMessage('gamePlayerQuit', GamePlayerQuitMessage, 'lastOnly')
    ev.messageRegister.registerMessage('requestGameMidwayJoin', RequestGameMidwayJoinMessage, 'lastOnly')
    ev.messageRegister.registerMessage('responseGameMidwayJoin', ResponseGameMidwayJoinMessage, 'noBuffer')
  }

  public registerMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    ev.messageListenerRegister.on('priorGameData', this.priorGameData.bind(this))
    ev.messageListenerRegister.on('responseGameHost', this.gameHost.bind(this))
    ev.messageListenerRegister.on('gameStart', this.gameStart.bind(this))
    ev.messageListenerRegister.on('responseGameEnd', this.gameEnd.bind(this))
    ev.messageListenerRegister.on('responseGameAbort', this.gameAbort.bind(this))
    ev.messageListenerRegister.on('responseGameMidwayJoin', this.gameMidwayJoin.bind(this))
  }

  /**
   * 途中参加のプレイヤーに進行中のゲームを通知する
   * イベントを発火し、それぞれのゲームプラグインで処理を行う
   */
  private priorGameData(msg: PriorGameDataMessage): void {
    this.eventBus.post(new PriorGameDataEvent(msg.data.runningGameId, msg.data.ownerId, msg.data.gameState))
  }

  private gameHost(msg: ResponseGameHostMessage): void {
    this.eventBus.post(new GameHostEvent(msg.data.gameId, msg.data.ownerId, msg.data.timeoutSec))
  }

  private gameStart(msg: GameStartMessage): void {
    this.eventBus.post(new GameStartEvent(msg.data.gameId, msg.data.ownerId, msg.data.joinedPlayerIds))
  }

  private gameEnd(msg: ResponseGameEndMessage): void {
    this.eventBus.post(new GameEndEvent(msg.data.gameId))
  }

  private gameAbort(msg: ResponseGameAbortMessage): void {
    this.eventBus.post(new GameAbortEvent(msg.data.gameId, msg.data.playerId))
  }

  private gameMidwayJoin(msg: ResponseGameMidwayJoinMessage): void {
    this.eventBus.post(new GameMidwayJoinEvent(msg.data.gameId, msg.data.joinPlayerId, msg.data.joinedPlayerIds))
  }
}
