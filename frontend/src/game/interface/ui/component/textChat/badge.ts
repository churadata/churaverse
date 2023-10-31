import { IBadge } from '../../../../domain/IRender/IBadge'

export class Badge implements IBadge {
  private readonly badgeElement: HTMLDivElement

  public constructor() {
    const BADGE_SIZE = '14px'

    const div = document.createElement('div')
    div.style.position = 'absolute'
    div.style.backgroundColor = 'white'
    div.style.borderRadius = '9999px'
    div.style.height = BADGE_SIZE
    div.style.width = BADGE_SIZE
    div.style.pointerEvents = 'none'
    div.style.zIndex = '10'

    this.badgeElement = div

    this.deactivate()
  }

  public activate(): void {
    this.badgeElement.style.opacity = '1'
  }

  public deactivate(): void {
    this.badgeElement.style.opacity = '0'
  }

  public setBadgeOn(node: HTMLElement): void {
    node.appendChild(this.badgeElement)
  }

  public moveTo(top: number, right: number): void {
    this.badgeElement.style.top = `${top}px`
    this.badgeElement.style.right = `${right}px`
  }
}
