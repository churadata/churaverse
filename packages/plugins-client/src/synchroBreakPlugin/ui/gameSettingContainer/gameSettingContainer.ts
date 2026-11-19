import type { IGameUiComponent } from '@churaverse/game-plugin-client'
import type { NetworkPluginStore } from '@churaverse/network-plugin-client'
import {
  DomManager,
  domLayerSetting,
  type IMainScene,
  makeLayerHigherTemporary,
  type Store,
} from 'churaverse-engine-client'
import '@churaverse/player-plugin-client'
import '@churaverse/game-plugin-client'
import { SynchroBreakGameSettingMessage } from '../../message/synchroBreakGameSettingMessage'
import { GameSettingForm } from './component/gameSettingForm'

/**  turn入力部分 */
export const TURN_SELECT_FIELD_ID = 'turn-select-field-id'

/** turn数の増加部分 */
export const TURN_SELECT_INCREASE_BUTTON_ID = 'turn-select-increase'

/** turn数の減少部分 */
export const TURN_SELECT_DECREASE_BUTTON_ID = 'turn-select-decrease'

// turn数の最大値と最小値
export const SYNCHRO_BREAK_MAX_TURN = 10
export const SYNCHRO_BREAK_MIN_TURN = 1

/** 制限時間入力部分 */
export const TIME_LIMIT_INPUT_FIELD_ID = 'synchro-break-time-limit-input-field'

/** 制限時間増加ボタン */
export const TIME_LIMIT_INCREMENT_BUTTON_ID = 'synchro-break-time-limit-increment'

/** 制限時間減少ボタン */
export const TIME_LIMIT_DECREMENT_BUTTON_ID = 'synchro-break-time-limit-decrement'

// 制限時間の最大値と最小値
export const SYNCHRO_BREAK_MAX_TIME_LIMIT: number = 15
export const SYNCHRO_BREAK_MIN_TIME_LIMIT: number = 3

/** 設定送信ボタン */
export const GAME_SETTING_SEND_BUTTON_ID = 'game-setting-send'

export class GameSettingContainer implements IGameUiComponent {
  public element!: HTMLElement
  public readonly visible = false
  private turnInputField!: HTMLInputElement
  private timeInputField!: HTMLInputElement
  private readonly networkPluginStore!: NetworkPluginStore<IMainScene>

  public constructor(public readonly store: Store<IMainScene>) {
    this.networkPluginStore = this.store.of('networkPlugin')
  }

  //ターン数のゲッター・セッター
  private get turnValue(): number {
    const value = Number(this.turnInputField.value)
    return Number.isNaN(value) ? SYNCHRO_BREAK_MIN_TURN : value
  }
  private set turnValue(value: number) {
    this.turnInputField.value = value.toString()
  }

  //制限時間のゲッター・セッター
  private get timeLimitValue(): number {
    const value = Number(this.timeInputField.value)
    return Number.isNaN(value) ? SYNCHRO_BREAK_MAX_TIME_LIMIT : value
  }
  private set timeLimitValue(value: number) {
    this.timeInputField.value = value.toString()
  }

  public initialize(): void {
    this.setContainer()
    this.setupInputFields()
  }

  /*
   *各種入力・変更・送信ボタンのイベントを設定
   */
  private setupInputFields(): void {
    const playerId = this.store.of('playerPlugin').ownPlayerId

    //要素の取得
    this.turnInputField = DomManager.getElementById<HTMLInputElement>(TURN_SELECT_FIELD_ID)
    this.timeInputField = DomManager.getElementById<HTMLInputElement>(TIME_LIMIT_INPUT_FIELD_ID)
    const sendButton = DomManager.getElementById(GAME_SETTING_SEND_BUTTON_ID)

    //送信ボタンの処理
    sendButton.onclick = () => {
      const turn = this.turnValue
      const timeLimit = this.timeLimitValue

      const isTurnValid = SYNCHRO_BREAK_MIN_TURN <= turn && turn <= SYNCHRO_BREAK_MAX_TURN
      const isTimeValid = SYNCHRO_BREAK_MIN_TIME_LIMIT <= timeLimit && timeLimit <= SYNCHRO_BREAK_MAX_TIME_LIMIT

      if (isTurnValid && isTimeValid) {
        this.networkPluginStore.messageSender.send(
          new SynchroBreakGameSettingMessage({ playerId, allTurn: turn, timeLimit: timeLimit.toString() })
        )
        this.turnValue = SYNCHRO_BREAK_MIN_TURN
        this.timeLimitValue = SYNCHRO_BREAK_MIN_TIME_LIMIT
        this.close()
      } else {
        this.turnValue = SYNCHRO_BREAK_MIN_TURN
        this.timeLimitValue = SYNCHRO_BREAK_MIN_TIME_LIMIT
      }
    }

    //ターン数の＋ーボタンの設定
    const turnPlusBtn = DomManager.getElementById(TURN_SELECT_INCREASE_BUTTON_ID)
    turnPlusBtn.onclick = () => {
      if (this.turnValue >= SYNCHRO_BREAK_MAX_TURN) return
      this.turnValue = this.turnValue + 1
    }

    const turnMinusBtn = DomManager.getElementById(TURN_SELECT_DECREASE_BUTTON_ID)
    turnMinusBtn.onclick = () => {
      if (this.turnValue <= SYNCHRO_BREAK_MIN_TURN) return
      this.turnValue = this.turnValue - 1
    }

    //制限時間の＋ーボタンの設定
    const timePlusBtn = DomManager.getElementById(TIME_LIMIT_INCREMENT_BUTTON_ID)
    timePlusBtn.onclick = () => {
      if (this.timeLimitValue >= SYNCHRO_BREAK_MAX_TIME_LIMIT) return
      this.timeLimitValue = this.timeLimitValue + 1
    }

    const timeMinusBtn = DomManager.getElementById(TIME_LIMIT_DECREMENT_BUTTON_ID)
    timeMinusBtn.onclick = () => {
      if (this.timeLimitValue <= SYNCHRO_BREAK_MIN_TIME_LIMIT) return
      this.timeLimitValue = this.timeLimitValue - 1
    }
  }

  private setContainer(): void {
    this.element = DomManager.addJsxDom(GameSettingForm())
    domLayerSetting(this.element, 'lowest')
    this.element.addEventListener('click', () => {
      makeLayerHigherTemporary(this.element, 'lower')
    })
    this.close()
  }

  public open(): void {
    this.element.style.display = 'flex'
  }

  public close(): void {
    this.element.style.display = 'none'
  }

  public remove(): void {
    this.turnInputField.remove()
    this.timeInputField.remove()
  }
}
