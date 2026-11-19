import type { CVEvent, IEventBus, IMainScene, Scenes } from 'churaverse-engine-client'
import type { IDialog } from '../domain/interface/IRender/IDialog'
import { ActivateUiEvent } from '../event/activateUiEvent'
import { DeactivateUiEvent } from '../event/deactivateUiEvent'
import type { DialogType, IDialogSwitcher } from '../interface/IDialogSwitcher'

/**
 * dialogの切り替えを行う
 * 一度に開けるダイアログは0~1個
 */
export class DialogSwitcher implements IDialogSwitcher {
  private readonly dialogs = new Map<string, IDialog>()
  private readonly postCloseCallbacks = new Map<string, () => void>()
  private target: string | null = null

  public constructor(private readonly eventBus: IEventBus<IMainScene>) {}

  /**
   * ダイアログを管理対象にする
   * @param name 名前
   * @param dialog 操作対象のダイアログ
   * @param postClose ダイアログが閉じた際にすること
   */
  public add(name: DialogType, dialog: IDialog, postClose: () => void): void {
    this.dialogs.set(name, dialog)
    this.postCloseCallbacks.set(name, postClose)
  }

  /**
   * ダイアログを開く
   * @param name 名前
   * @param postOpen 開いた後にすること
   */
  public open(name: DialogType, postOpen: () => void): void {
    if (this.target === name) return
    if (this.target !== null) {
      this.close()
    }

    const targetDialog = this.dialogs.get(name)
    if (targetDialog === undefined) return
    targetDialog.open()
    postOpen()
    this.target = name

    this.eventBus.post(new ActivateUiEvent(targetDialog) as CVEvent<Scenes>)

    /**
     * onOutsideClickが即時発火するのを防ぐため、遅延をつけてイベントリスナーを追加
     */
    setTimeout(() => {
      if (this.target === name) {
        document.addEventListener('click', this.onOutsideClick)
      }
    })
  }

  /**
   * ダイアログを閉じる
   */
  public close(): void {
    document.removeEventListener('click', this.onOutsideClick)

    if (this.target !== null) {
      const targetDialog = this.dialogs.get(this.target)
      if (targetDialog === undefined) return
      targetDialog.close()
      this.postCloseCallbacks.get(this.target)?.()
      this.eventBus.post(new DeactivateUiEvent(targetDialog) as CVEvent<Scenes>)
      this.target = null
    }
  }

  /**
   * dialogの外側がクリックされたときの挙動
   *
   */
  private readonly onOutsideClick = (event: MouseEvent) => {
    if (this.target === null) return

    const dialog = this.dialogs.get(this.target)
    if (dialog === undefined) return

    if (event.target instanceof Node && !dialog.node.contains(event.target)) {
      this.close()
    }
  }
}
