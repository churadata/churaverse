import { DomManager } from '../../util/domManager'
import { TopBarIconRender } from './topBarIcon'

export class TopBarIconContainer {
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

  public addIcon(icon: TopBarIconRender): void {
    this.containerDiv.appendChild(icon.node)
  }
}
