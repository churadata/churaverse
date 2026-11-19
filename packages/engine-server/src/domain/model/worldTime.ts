/**
 * ワールドの時間を表すクラス
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class WorldTime {
  /**
   * ワールドの現在時刻を返す
   */
  public static now(): number {
    return Date.now()
  }
}
