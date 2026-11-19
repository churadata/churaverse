import type { IMainScene, Store } from 'churaverse-engine-client'
import type { INyokkiLogTextCreator } from '../interface/INyokkiLogTextCreator'

const successLog = [
  'はnyokkiに成功しました',
  '素晴らしい!!、nyokki成功',
  'nyokki成功。ナイス!!',
  'nyokkiミッション成功',
  'は見事にnyokkiを達成しました',
  'nyokki達成お見事',
  '最高のnyokki成功',
  '完璧なnyokki',
  'nyokki成功',
  'nyokki成功、賞金ゲット!!',
] as const

const failureLog = [
  'はnyokkiに失敗しました。次は頑張って!!',
  'のnyokkiが被ったーー',
  '息ぴったし',
  'のnyokki失敗、次は賞金を狙おう!!',
  'はチャレンジ失敗',
  'はnyokki達成ならず、残念',
  '惜しい、nyokki失敗',
  'nyokki失敗、また挑戦しよう',
  '残念、nyokkiはうまくいきませんでした',
  'のnyokki失敗',
] as const

export class NyokkiLogTextCreator implements INyokkiLogTextCreator {
  public constructor(private readonly store: Store<IMainScene>) {}

  /**
   * ニョッキアクションを実行時のログテキストを作成する
   * @param playerIds ニョッキアクションを実行したplayerIdの配列
   * @param isSuccess ニョッキアクションの成功可否
   */
  public createNyokkiLogText(playerIds: string[], isSuccess: boolean, nyokkiTime: number): string | undefined {
    if (isSuccess) {
      return this.createSuccessLog(playerIds, nyokkiTime)
    } else {
      return this.createFailureLog(playerIds, nyokkiTime)
    }
  }

  /**
   * ニョッキ成功時のログを生成する
   */
  private createSuccessLog(playerIds: string[], seed: number): string | undefined {
    const playerName = this.store.of('playerPlugin').players.get(playerIds[0])?.name
    if (playerName === undefined) return undefined

    // 成功したメッセージをseedを基に選択する
    const i = Math.floor(seed / 100) % successLog.length
    const message = successLog[i]
    return `${playerName}さん${message}`
  }

  /**
   * ニョッキ失敗時のログを生成する
   */
  private createFailureLog(playerIds: string[], seed: number): string {
    const playerNames = this.createPlayerNamePhrase(playerIds)

    // 失敗したメッセージをseedを基に選択する
    const i = Math.floor(seed / 100) % failureLog.length
    const message = failureLog[i]
    return `${playerNames}${message}`
  }

  /**
   * ニョッキアクションを未実行時のログテキストを作成する
   * @param playerIds ニョッキアクションを未実行のプレイヤーplayerIdの配列
   */
  public createNoNyokkiLogText(playerIds: string[]): string {
    const playerNames = this.createPlayerNamePhrase(playerIds)
    return `${playerNames}ニョッキ不発...`
  }

  /**
   * プレイヤー名を結合した文字列を作成する
   */
  private createPlayerNamePhrase(playerIds: string[]): string {
    return playerIds
      .map((playerId) => this.store.of('playerPlugin').players.get(playerId)?.name)
      .filter((playerName) => playerName !== undefined)
      .map((playerName) => `${playerName}さん`)
      .join('と')
  }
}
