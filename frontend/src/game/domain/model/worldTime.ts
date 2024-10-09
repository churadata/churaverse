/**
 * ワールドの時間を表すクラス
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class WorldTime {
  /**
   * Date.now()とサーバ側のDate.now()との差
   */
  private static _delay: number = 0

  public static addDelay(delay: number): void {
    this._delay += delay
  }

  public static setDelay(delay: number): void {
    this._delay = delay
  }

  public static get delay(): number {
    return this._delay
  }

  /**
   * ワールドの現在時刻を返す
   */
  public static now(): number {
    return Date.now() + this._delay
  }
}
