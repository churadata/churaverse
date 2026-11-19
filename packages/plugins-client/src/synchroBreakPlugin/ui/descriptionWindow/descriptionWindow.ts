import { DomManager, domLayerSetting } from 'churaverse-engine-client'
import { DescriptionWindowComponent } from './component/DescriptionWindowComponent'
import '@churaverse/game-plugin-client'
import type { IDescriptionWindow } from '../../interface/IDescriptionWindow'

export const SYNCHRO_BREAK_DESCRIPTION_TEXT_ID = 'synchro-break-description-text'

export class DescriptionWindow implements IDescriptionWindow {
  public element!: HTMLElement
  public visible: boolean = false
  private descriptionTextElement?: HTMLElement
  private gameName: string = 'ゲーム'
  private gameOwnerName: string = 'ゲームオーナー'

  private get descriptionText(): string {
    this.descriptionTextElement =
      this.descriptionTextElement ?? DomManager.getElementById(SYNCHRO_BREAK_DESCRIPTION_TEXT_ID)
    return this.descriptionTextElement.innerHTML ?? ''
  }

  private set descriptionText(text: string) {
    this.descriptionTextElement =
      this.descriptionTextElement ?? DomManager.getElementById(SYNCHRO_BREAK_DESCRIPTION_TEXT_ID)
    if (this.descriptionTextElement !== undefined) {
      this.descriptionTextElement.innerHTML = text
    }
  }

  public initialize(): void {
    this.element = DomManager.addJsxDom(DescriptionWindowComponent({ description: '' }))
    this.descriptionTextElement = DomManager.getElementById(SYNCHRO_BREAK_DESCRIPTION_TEXT_ID)
    domLayerSetting(this.element, 'lowest')
  }

  public remove(): void {
    this.descriptionText = ''
    this.descriptionTextElement = undefined
  }

  public close(): void {
    this.element.style.display = 'none'
  }

  public setGameBaseInfo(gameName: string, ownerName: string): void {
    this.gameName = gameName
    this.gameOwnerName = ownerName
  }

  /**
   * ゲーム開始時主催者サイドの文章更新処理
   */
  public displayGameStartForOwner(): void {
    this.descriptionText = `${this.gameName}を開始しました。<br>あなたはゲームの管理者です。 <br>ターン数(1~10)と制限時間(3~15)を選択してください。`
    this.open()
  }

  /**
   * ゲーム開始時参加者サイドの文章更新処理
   */
  public displayGameStartForGuest(): void {
    this.descriptionText = `${this.gameName}が開始されました！<br>${this.gameOwnerName}さんがターン数と制限時間を入力中です。`
    this.open()
  }

  /**
   * 主催者サイドの制限時間入力後の文章更新処理
   * @param turn 選択されたターン数
   * @param timeLimit 選択された制限時間
   * @param ownCoins 所持コイン数
   */
  public displayGameSettingForOwner(turn: number, timeLimit: string, ownCoins: number): void {
    this.descriptionText = `ターン数${turn}, 制限時間${timeLimit}秒を選択しました。<br>ベットコインを入力してください。<br>所持コイン数:${ownCoins}`
  }

  /**
   * 参加者サイドの制限時間入力後の文章更新処理
   * @param turn 選択されたターン数
   * @param timeLimit 選択された制限時間
   * @param ownCoins 所持コイン数
   */
  public displayGameSettingForGuest(turn: number, timeLimit: string, ownCoins: number): void {
    this.descriptionText = `ターン数${turn}、 制限時間${timeLimit}秒が選択されました。<br>ベットコインを入力してください。<br>所持コイン数:${ownCoins}`
  }

  /**
   * ベットコイン選択後の文章更新処理
   * @param betCoins 選択されたベットコイン数
   */
  public displayBetCoinSelection(betCoins: number): void {
    this.descriptionText = `ベットコインを${betCoins}枚選択しました。<br>相手のベットコインを待っています。`
  }

  /**
   * ゲーム開始カウントダウンの文章更新処理
   * @param countdown ゲーム開始までのカウントダウン
   */
  public displayGameStartCountdown(countdown: number): void {
    this.descriptionText = `ゲーム開始まで<br>${countdown}秒`
  }

  /**
   * シンクロブレイク開始の文章更新処理
   */
  public displaySynchroBreakStart(): void {
    this.descriptionText = `${this.gameName}開始！！！<br>制限時間以内にボタンを押してください！`
  }

  /**
   * シンクロブレイク進行中の文章更新処理
   */
  public displaySynchroBreakInProgress(playerName?: string, nyokkiActionMessage?: string): void {
    const descriptionText = [`現在${this.gameName}進行中`, `制限時間内にボタンを押してください！`]
    if (playerName !== undefined && nyokkiActionMessage !== undefined) {
      descriptionText.splice(1, 0, nyokkiActionMessage)
    }

    this.descriptionText = descriptionText.join('<br>')
  }

  /**
   * シンクロブレイク終了の文章更新処理
   */
  public displaySynchroBreakEnd(): void {
    this.descriptionText = `${this.gameName}終了！！！`
  }

  /**
   * ターン終了の文章更新処理
   * @param turnNumber 残りターン数
   */
  public displayTurnStart(turnNumber: number, ownCoins: number): void {
    this.descriptionText = `残り${turnNumber}ターンです。<br>ベットコインを入力してください。<br>所持コイン数:${ownCoins}`
  }

  /**
   * ニョッキアクションの文章更新処理
   * @param text ニョッキアクションの文章
   */
  public displayNyokkiAction(text: string): void {
    const descriptionText = this.descriptionText.split('<br>')
    descriptionText.splice(1, 0, text)
    this.descriptionText = descriptionText.join('<br>')
  }

  /**
   * 結果ウィンドウ表示時のメッセージ表示
   */
  public displayResultMessage(): void {
    this.descriptionText =
      '〜最終ランキング〜</br>お疲れ様でした。</br>閉じるボタンを押すと通常のちゅらバースに戻ります。'
  }

  private open(): void {
    this.element.style.display = 'flex'
  }
}
