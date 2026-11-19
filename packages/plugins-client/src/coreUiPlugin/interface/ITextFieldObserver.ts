export interface ITextFieldObserver {
  /**
   * テキストフィールドに入力中の間はtrue
   */
  isTextInputting: boolean

  addTargetTextField: (textField: HTMLInputElement) => void
}
