/**
 * Dialog: 一時的に開かれる画面
 */
export interface IDialog {
  close: () => void
  open: () => void
  isOpen: boolean
}
