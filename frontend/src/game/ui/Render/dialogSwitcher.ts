import { IDialog } from '../../domain/IRender/IDialog'

/**
 * dialogの切り替えを行う
 * 一度に開けるダイアログは0~1個
 */
export class DialogSwitcher {
  private readonly dialogs = new Map<string, IDialog>()
  private readonly postCloseCallbacks = new Map<string, () => void>()
  private target: string | null = null

  /**
   * ダイアログを管理対象にする
   * @param name 名前
   * @param dialog 操作対象のダイアログ
   * @param postClose タイアログが閉じた際にすること
   */
  public add(name: string, dialog: IDialog, postClose: () => void): void {
    this.dialogs.set(name, dialog)
    this.postCloseCallbacks.set(name, postClose)
  }

  /**
   * タイアログを開く
   * @param name 名前
   * @param postOpen 開いた後にすること
   */
  public open(name: string, postOpen: () => void): void {
    if (this.target === name) {
      return
    }

    if (this.target !== null) {
      this.close()
    }

    this.dialogs.get(name)?.open()
    postOpen()
    this.target = name
  }

  /**
   * ダイアログを閉じる
   */
  public close(): void {
    if (this.target !== null) {
      this.dialogs.get(this.target)?.close()
      this.postCloseCallbacks.get(this.target)?.()
      this.target = null
    }
  }
}
