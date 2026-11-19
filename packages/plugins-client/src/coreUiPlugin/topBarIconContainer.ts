import { DomManager } from 'churaverse-engine-client'
import type { ITopBarIconContainer } from './interface/ITopBarIconContainer'
import type { TopBarIconRenderer } from './topBarIcon'

export class TopBarIconContainer implements ITopBarIconContainer {
  private readonly containerDiv: HTMLDivElement

  public constructor() {
    this.containerDiv = document.createElement('div')
    this.containerDiv.style.display = 'flex'
    this.containerDiv.style.flexDirection = 'row-reverse'
    this.containerDiv.style.columnGap = '5px'
    this.containerDiv.style.top = '50px'
    this.containerDiv.style.right = '50px'

    DomManager.addDom(this.containerDiv)
  }

  /**
   * 引数のIconを追加する。並び順を制御するにはITopBarIconRenderのorderプロパティを用いる。
   */
  public addIcon(icon: TopBarIconRenderer): void {
    this.containerDiv.appendChild(icon.node)
  }
}
