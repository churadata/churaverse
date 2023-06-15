import { ITextFieldObserver } from '../../../interactor/ITextFieldObserver'

/**
 * TextFieldに入力中かどうかを監視する
 */
export class TextFieldObserver implements ITextFieldObserver {
  private _isTextInputting = false
  private readonly textFields: HTMLInputElement[] = []

  /**
   * 監視対象のテキストフィールドを追加する
   * @param textField 監視対象に追加したいTextField
   */
  public addTargetTextField(textField: HTMLInputElement): void {
    this.textFields.push(textField)

    // textFieldがfocusされた場合(入力中の場合) _isTextInputtingをtrueに
    textField.addEventListener('focus', () => {
      this._isTextInputting = true
    })

    // textFieldのfocusが外れた場合(入力中でなくなった場合) _isTextInputtingをfalseに
    textField.addEventListener('blur', () => {
      this._isTextInputting = false
    })
  }

  public get isTextInputting(): boolean {
    return this._isTextInputting
  }
}
