import {
  BaseSocketController,
  type IMessageListenerRegister,
  type RegisterMessageEvent,
  type RegisterMessageListenerEvent,
} from '@churaverse/network-plugin-client'
import type { IEventBus, IMainScene, Store } from 'churaverse-engine-client'
import { BetTimeRemainingEvent } from '../event/betTimeRemainingEvent'
import { NyokkiActionResponseEvent } from '../event/nyokkiActionResponseEvent'
import { SendBetCoinResponseEvent } from '../event/sendBetCoinResponseEvent'
import { SynchroBreakTurnStartEvent } from '../event/synchroBerakTurnStartEvent'
import { SynchroBreakGameSettingEvent } from '../event/synchroBreakGameSettingEvent'
import { SynchroBreakResultEvent } from '../event/synchroBreakResultEvent'
import { SynchroBreakStartCountEvent } from '../event/synchroBreakStartCountEvent'
import { SynchroBreakTurnEndEvent } from '../event/synchroBreakTurnEndEvent'
import { SynchroBreakTurnTimerEvent } from '../event/synchroBreakTurnTimerEvent'
import { UpdatePlayersCoinEvent } from '../event/updatePlayersCoinEvent'
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
    ev.messageRegister.registerMessage('synchroBreakGameSetting', SynchroBreakGameSettingMessage, 'queue')
    ev.messageRegister.registerMessage('sendBetCoin', SendBetCoinMessage, 'queue')
    ev.messageRegister.registerMessage('sendBetCoinResponse', SendBetCoinResponseMessage, 'queue')
    ev.messageRegister.registerMessage('synchroBreakStartCount', SynchroBreakStartCountMessage, 'queue')
    ev.messageRegister.registerMessage('synchroBreakTurnTimer', SynchroBreakTurnTimerMessage, 'queue')
    ev.messageRegister.registerMessage('nyokki', NyokkiMessage, 'queue')
    ev.messageRegister.registerMessage('nyokkiActionResponse', NyokkiActionResponseMessage, 'queue')
    ev.messageRegister.registerMessage('synchroBreakTurnEnd', SynchroBreakTurnEndMessage, 'queue')
    ev.messageRegister.registerMessage('synchroBreakTurnStart', SynchroBreakTurnStartMessage, 'queue')
    ev.messageRegister.registerMessage('updatePlayersCoin', UpdatePlayersCoinMessage, 'queue')
    ev.messageRegister.registerMessage('synchroBreakResult', SynchroBreakResultMessage, 'queue')
    ev.messageRegister.registerMessage('betTimeRemaining', BetTimeRemainingMessage, 'queue')
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
    this.messageListenerRegister.on('sendBetCoinResponse', this.sendBetCoinResponse)
    this.messageListenerRegister.on('synchroBreakStartCount', this.gameStartCount)
    this.messageListenerRegister.on('synchroBreakTurnTimer', this.turnTimer)
    this.messageListenerRegister.on('nyokkiActionResponse', this.nyokkiActionResponse)
    this.messageListenerRegister.on('synchroBreakTurnEnd', this.synchroBreakTurnEnd)
    this.messageListenerRegister.on('synchroBreakTurnStart', this.synchroBreakTurnStart)
    this.messageListenerRegister.on('updatePlayersCoin', this.updatePlayersCoin)
    this.messageListenerRegister.on('synchroBreakResult', this.synchroBreakResult)
    this.messageListenerRegister.on('betTimeRemaining', this.betTimeRemaining)
  }

  /**
   * メッセージリスナーを解除する
   */
  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('synchroBreakGameSetting', this.synchroBreakGameSetting)
    this.messageListenerRegister.off('sendBetCoinResponse', this.sendBetCoinResponse)
    this.messageListenerRegister.off('synchroBreakStartCount', this.gameStartCount)
    this.messageListenerRegister.off('synchroBreakTurnTimer', this.turnTimer)
    this.messageListenerRegister.off('nyokkiActionResponse', this.nyokkiActionResponse)
    this.messageListenerRegister.off('synchroBreakTurnEnd', this.synchroBreakTurnEnd)
    this.messageListenerRegister.off('synchroBreakTurnStart', this.synchroBreakTurnStart)
    this.messageListenerRegister.off('updatePlayersCoin', this.updatePlayersCoin)
    this.messageListenerRegister.off('synchroBreakResult', this.synchroBreakResult)
    this.messageListenerRegister.off('betTimeRemaining', this.betTimeRemaining)
  }

  private readonly synchroBreakGameSetting = (msg: SynchroBreakGameSettingMessage): void => {
    this.eventBus.post(new SynchroBreakGameSettingEvent(msg.data.playerId, msg.data.allTurn, msg.data.timeLimit))
  }

  private readonly sendBetCoinResponse = (msg: SendBetCoinResponseMessage): void => {
    this.eventBus.post(new SendBetCoinResponseEvent(msg.data.playerId, msg.data.betCoins, msg.data.currentCoins))
  }

  private readonly gameStartCount = (msg: SynchroBreakStartCountMessage): void => {
    this.eventBus.post(new SynchroBreakStartCountEvent(msg.data.remainingSeconds))
  }

  private readonly turnTimer = (msg: SynchroBreakTurnTimerMessage): void => {
    this.eventBus.post(new SynchroBreakTurnTimerEvent(msg.data.remainingSeconds))
  }

  private readonly nyokkiActionResponse = (msg: NyokkiActionResponseMessage): void => {
    this.eventBus.post(
      new NyokkiActionResponseEvent(msg.data.sameTimePlayersId, msg.data.isSuccess, msg.data.nyokkiTime, msg.data.order)
    )
  }

  private readonly synchroBreakTurnEnd = (msg: SynchroBreakTurnEndMessage): void => {
    this.eventBus.post(new SynchroBreakTurnEndEvent(msg.data.noNyokkiPlayerIds))
  }

  private readonly synchroBreakTurnStart = (msg: SynchroBreakTurnStartMessage): void => {
    this.eventBus.post(new SynchroBreakTurnStartEvent(msg.data.turnNumber))
  }

  private readonly updatePlayersCoin = (msg: UpdatePlayersCoinMessage): void => {
    this.eventBus.post(new UpdatePlayersCoinEvent(msg.data.playersCoin))
  }

  private readonly synchroBreakResult = (msg: SynchroBreakResultMessage): void => {
    this.eventBus.post(new SynchroBreakResultEvent(msg.data.resultScreenType))
  }

  private readonly betTimeRemaining = (msg: BetTimeRemainingMessage): void => {
    this.eventBus.post(new BetTimeRemainingEvent(msg.data.remainingTime))
  }
}
