import { IDomInputObserver } from '../../../interactor/IDomInputObserver'

/**
 * DomFieldに入力中かどうかを監視する
 */
export class DomInputObserver implements IDomInputObserver {
  private _isInputting = false
  private readonly targetElements: HTMLInputElement[] = []

  /**
   * 監視対象のDOMを追加する
   * @param target 監視対象に追加したいDom
   */
  public addTargetDom(target: HTMLInputElement): void {
    this.targetElements.push(target)

    // domFieldがfocusされた場合(入力中の場合) _isDomInputtingをtrueに
    target.addEventListener('focus', () => {
      this._isInputting = true
    })

    // domFieldのfocusが外れた場合(入力中でなくなった場合) _isDomInputtingをfalseに
    target.addEventListener('blur', () => {
      this._isInputting = false
    })
  }

  public get isInputting(): boolean {
    return this._isInputting
  }
}
