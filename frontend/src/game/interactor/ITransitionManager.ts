export const SceneName = ['Title', 'Main'] as const

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SceneName = typeof SceneName[number]

/**
 * interactorから画面遷移をコントロールするためのinterface
 */
export interface ITransitionManager<ReceiveTransitionData = undefined, SendTransitionData = undefined> {
  /**
   * 画面遷移する
   * @param dest 遷移先のScene名
   * @param sendData 遷移先に受けわたすデータ
   */
  transitionTo: (dest: SceneName, sendData?: SendTransitionData) => void

  /**
   * 遷移元のSceneから渡されたデータを取得する
   */
  getReceivedData: () => ReceiveTransitionData
}
