import type { IFocusableRenderer } from '../interface/IFocusableRenderer'
import type { IFocusTargetRepository } from '../interface/IFocusTargetRepository'

// storeで共有して外部からアクセスする際はIFocusTargetRepositoryとしてのみ扱う
// CoreUiPlugin内で扱う時はFocusSwitcher型として扱いfocusNextも使える
// 外部からfucusNextしたい場合はFocusNextTargetEventをpostする
export class FocusSwitcher implements IFocusTargetRepository {
  private readonly targets: IFocusableRenderer[] = []
  private nowFocusIdx = 0

  public addFocusTarget(target: IFocusableRenderer): void {
    if (this.targets.includes(target)) {
      console.warn('既にaddFocusTargetされている要素', target)
      return
    }

    this.targets.push(target)
  }

  public removeFocusTarget(target: IFocusableRenderer): void {
    const targetIdx = this.targets.indexOf(target)
    if (targetIdx === -1) {
      console.warn('targetsに存在しない要素', target, this.targets)
      return
    }

    this.targets.splice(targetIdx, 1)

    // targetIdxがnowFocusIdx以下の場合は削除によりnowFocusIdxが1ずれる
    if (targetIdx <= this.nowFocusIdx) {
      this.nowFocusIdx -= 1

      // targetIdx == nowFocusIdxだった場合を考慮してフォーカスし直す
      this.targets[this.nowFocusIdx].focus()
    }
  }

  /**
   * フォーカス対象を切り替える.
   *
   * フォーカス対象の配列の中の、現在フォーカスしている要素の次の要素にフォーカスする.
   */
  public focusNext(): void {
    this.nowFocusIdx = (this.nowFocusIdx + 1) % this.targets.length
    this.targets[this.nowFocusIdx].focus()
  }
}
