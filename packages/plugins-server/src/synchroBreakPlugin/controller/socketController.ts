import {
  BaseSocketController,
  type IMessageListenerRegister,
  type RegisterMessageEvent,
  type RegisterMessageListenerEvent,
} from '@churaverse/network-plugin-server'
import type { IEventBus, IMainScene, Store } from 'churaverse-engine-server'
import { NyokkiEvent } from '../event/nyokkiEvent'
import { SendBetCoinEvent } from '../event/sendBetCoinEvent'
import { SynchroBreakGameSettingEvent } from '../event/synchroBreakGameSettingEvent'
import { BetTimeRemainingMessage } from '../message/betTimeRemainingMessage'
import { NyokkiActionResponseMessage } from '../message/nyokkiActionResponseMessage'
import { NyokkiMessage } from '../message/nyokkiMessage'
import { SendBetCoinMessage } from '../message/sendBetCoinMessage'
import { SendBetCoinResponseMessage } from '../message/sendBetCoinResponseMessage'
import { SynchroBreakGameSettingMessage } from '../message/synchroBreakGameSettingMessage'
import { SynchroBreakResultMessage } from '../message/synchroBreakResultMessage'
import { SynchroBreakStartCountMessage } from '../message/synchroBreakStartCountMessage'
import { SynchroBreakTurnEndMessage } from '../message/synchroBreakTurnEndMessage'
import { SynchroBreakTurnStartMessage } from '../message/synchroBreakTurnStartMessage'
import { SynchroBreakTurnTimerMessage } from '../message/synchroBreakTurnTimerMessage'
import { UpdatePlayersCoinMessage } from '../message/updatePlayersCoinMessage'

export class SocketController extends BaseSocketController<IMainScene> {
  private messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('synchroBreakGameSetting', SynchroBreakGameSettingMessage, 'allClients')
    ev.messageRegister.registerMessage('sendBetCoin', SendBetCoinMessage, 'onlyServer')
    ev.messageRegister.registerMessage('sendBetCoinResponse', SendBetCoinResponseMessage, 'allClients')
    ev.messageRegister.registerMessage('synchroBreakStartCount', SynchroBreakStartCountMessage, 'allClients')
    ev.messageRegister.registerMessage('synchroBreakTurnTimer', SynchroBreakTurnTimerMessage, 'allClients')
    ev.messageRegister.registerMessage('nyokki', NyokkiMessage, 'onlyServer')
    ev.messageRegister.registerMessage('nyokkiActionResponse', NyokkiActionResponseMessage, 'allClients')
    ev.messageRegister.registerMessage('synchroBreakTurnEnd', SynchroBreakTurnEndMessage, 'allClients')
    ev.messageRegister.registerMessage('synchroBreakTurnStart', SynchroBreakTurnStartMessage, 'allClients')
    ev.messageRegister.registerMessage('updatePlayersCoin', UpdatePlayersCoinMessage, 'allClients')
    ev.messageRegister.registerMessage('synchroBreakResult', SynchroBreakResultMessage, 'allClients')
    ev.messageRegister.registerMessage('betTimeRemaining', BetTimeRemainingMessage, 'allClients')
  }

  /**
   * messageListenerRegisterをセットアップする
   */
  public setupMessageListenerRegister(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  /**
   * メッセージリスナーを登録する
   */
  public registerMessageListener(): void {
    this.messageListenerRegister.on('synchroBreakGameSetting', this.synchroBreakGameSetting)
    this.messageListenerRegister.on('sendBetCoin', this.sendBetCoin)
    this.messageListenerRegister.on('nyokki', this.nyokki)
  }

  /**
   * メッセージリスナーを解除する
   */
  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('synchroBreakGameSetting', this.synchroBreakGameSetting)
    this.messageListenerRegister.off('sendBetCoin', this.sendBetCoin)
    this.messageListenerRegister.off('nyokki', this.nyokki)
  }
  private readonly synchroBreakGameSetting = (msg: SynchroBreakGameSettingMessage): void => {
    this.eventBus.post(new SynchroBreakGameSettingEvent(msg.data.allTurn, msg.data.playerId, msg.data.timeLimit))
  }

  private readonly sendBetCoin = (msg: SendBetCoinMessage): void => {
    this.eventBus.post(new SendBetCoinEvent(msg.data.playerId, msg.data.betCoins))
  }

  private readonly nyokki = (msg: NyokkiMessage): void => {
    this.eventBus.post(new NyokkiEvent(msg.data.playerId))
  }
}
