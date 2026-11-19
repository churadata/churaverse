import {
  DomManager,
  domLayerSetting,
  type IMainScene,
  makeLayerHigherTemporary,
  type Store,
} from 'churaverse-engine-client'
import type { IBetCoinFormContainer } from '../../interface/IBetCoinFormContainer'
import { SendBetCoinMessage } from '../../message/sendBetCoinMessage'
import { BetCoinForm } from './component/BetCoinForm'

/** ベットコイン枚数入力部分 */
export const BET_COIN_INPUT_FIELD_ID = 'bet-coin-input-field'

/** ベットコインの枚数増加ボタン */
export const BET_COIN_INCREMENT_BUTTON_ID = 'bet-coin-increment'

/** ベットコインの枚数減少ボタン */
export const BET_COIN_DECREMENT_BUTTON_ID = 'bet-coin-decrement'

/** ベットコイン送信ボタン */
export const BET_COIN_SEND_BUTTON_ID = 'bet-coin-send-button'

// ベットコインの最小値と最大値
export const SYNCHRO_BREAK_MIN_BET_COIN: number = 0
export const SYNCHRO_BREAK_MAX_BET_COIN: number = 999

export class BetCoinFormContainer implements IBetCoinFormContainer {
  public element!: HTMLElement
  public readonly visible: boolean = false
  private betCoinInputField!: HTMLInputElement
  private isSend: boolean = false

  public constructor(private readonly store: Store<IMainScene>) {}

  private get inputFieldValue(): number {
    const value = Number(this.betCoinInputField.value)
    return Number.isNaN(value) ? SYNCHRO_BREAK_MIN_BET_COIN : value
  }

  private set inputFieldValue(value: number) {
    this.betCoinInputField.value = value.toString()
  }

  public initialize(): void {
    this.setBetCoinFormContainer()
    const ownPlayerId = this.store.of('playerPlugin').ownPlayerId
    this.setupInputFields(ownPlayerId)
    this.isSend = false
  }

  /**
   * タイムアウト時に、フォームに入力されているベットコインの枚数をポストする
   */
  public postBetCoinOnTimeout(ownPlayerId: string): void {
    if (this.isSend) return

    const betCoins = this.isValidBetAmount(ownPlayerId) ? this.inputFieldValue : SYNCHRO_BREAK_MIN_BET_COIN
    this.store.of('networkPlugin').messageSender.send(new SendBetCoinMessage({ playerId: ownPlayerId, betCoins }))
    this.inputFieldValue = SYNCHRO_BREAK_MIN_BET_COIN
    this.isSend = true
    this.close()
  }

  /**
   * ベットコインの入力部分を設定する
   */
  private setupInputFields(ownPlayerId: string): void {
    this.betCoinInputField = DomManager.getElementById<HTMLInputElement>(BET_COIN_INPUT_FIELD_ID)
    const sendButton = DomManager.getElementById(BET_COIN_SEND_BUTTON_ID)
    sendButton.onclick = () => {
      const isBetAmountValid = this.isValidBetAmount(ownPlayerId)
      const betCoins = isBetAmountValid ? this.inputFieldValue : SYNCHRO_BREAK_MIN_BET_COIN

      if (isBetAmountValid) {
        this.store.of('networkPlugin').messageSender.send(new SendBetCoinMessage({ playerId: ownPlayerId, betCoins }))
        this.inputFieldValue = SYNCHRO_BREAK_MIN_BET_COIN
        this.isSend = true
        this.close()
      } else {
        this.inputFieldValue = SYNCHRO_BREAK_MIN_BET_COIN
      }
    }

    const plusButton = DomManager.getElementById(BET_COIN_INCREMENT_BUTTON_ID)

    plusButton.onclick = () => {
      this.incrementBetCoin(ownPlayerId)
    }

    this.setupLongPress(plusButton, () => {
      this.incrementBetCoin(ownPlayerId)
    })

    const minusButton = DomManager.getElementById(BET_COIN_DECREMENT_BUTTON_ID)

    minusButton.onclick = () => {
      this.decrementBetCoin()
    }

    this.setupLongPress(minusButton, () => {
      this.decrementBetCoin()
    })
  }

  /**
   * ベットコイン枚数が有効な範囲内かチェックする
   */
  private isValidBetAmount(ownPlayerId: string): boolean {
    const betCoins = this.inputFieldValue
    const ownPlayerCoins = this.store.of('synchroBreakPlugin').playersCoinRepository.get(ownPlayerId)
    return SYNCHRO_BREAK_MIN_BET_COIN <= betCoins && betCoins <= ownPlayerCoins
  }

  /**
   * ベットコインをインクリメントする
   */
  private incrementBetCoin(ownPlayerId: string): void {
    const ownPlayerCoins = this.store.of('synchroBreakPlugin').playersCoinRepository.get(ownPlayerId)
    const betCoins = this.inputFieldValue

    if (betCoins >= ownPlayerCoins || betCoins >= SYNCHRO_BREAK_MAX_BET_COIN) return
    this.inputFieldValue = betCoins + 1
  }

  /**
   * ベットコインをデクリメントする
   */
  private decrementBetCoin(): void {
    const betCoins = this.inputFieldValue

    if (betCoins <= SYNCHRO_BREAK_MIN_BET_COIN) return
    this.inputFieldValue = betCoins - 1
  }

  /**
   * ボタンの長押し機能を設定する
   */
  private setupLongPress(button: HTMLElement, action: () => void): void {
    let longPressTimerId: number
    let longPressIntervalId: number

    const startLongPress = (): void => {
      longPressTimerId = window.setTimeout(() => {
        longPressIntervalId = window.setInterval(() => {
          action()
        }, 100)
      }, 500)
    }

    const stopLongPress = (): void => {
      clearTimeout(longPressTimerId)
      clearInterval(longPressIntervalId)
    }

    button.addEventListener('mousedown', startLongPress)
    button.addEventListener('mouseup', stopLongPress)
    button.addEventListener('mouseleave', stopLongPress)
  }

  private setBetCoinFormContainer(): void {
    this.element = DomManager.addJsxDom(BetCoinForm())
    domLayerSetting(this.element, 'lowest')
    this.element.addEventListener('click', () => {
      makeLayerHigherTemporary(this.element, 'lower')
    })
    this.close()
  }

  public open(): void {
    this.element.style.display = 'flex'
    this.isSend = false
  }

  public close(): void {
    this.element.style.display = 'none'
  }

  public remove(): void {
    this.betCoinInputField.remove()
  }
}
