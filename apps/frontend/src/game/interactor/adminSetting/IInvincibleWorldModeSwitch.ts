export interface IInvincibleWorldModeSwitch {
  /**
   * 初期状態の設定
   * 初期状態で選択されている場合はchecked=true
   * interactorでpreloadedDataを取得した後に実行する
   */
  initState: (checked: boolean) => void

  setChecked: (checked: boolean) => void

  getChecked: () => boolean
}
