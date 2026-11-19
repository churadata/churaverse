export interface ICountdownTimer {
  /** カウントダウンタイマーを開始する */
  start: (seconds: number) => void
  /** カウントダウンタイマーを非表示にする */
  close: () => void
}
