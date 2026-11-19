import type { IMainScene, Store } from 'churaverse-engine-client'
import type { IBadge } from '../interface/IBadge'

export class Badge implements IBadge {
  private readonly badgeElement: HTMLDivElement

  public constructor(private readonly store: Store<IMainScene>) {
    const BadgeSize = '20px'

    const div = document.createElement('div')
    div.style.position = 'absolute'
    div.style.backgroundColor = '#ff5252'

    div.style.color = 'white'
    div.style.fontSize = '12px'
    div.style.fontWeight = 'bold'

    div.style.display = 'flex'
    div.style.justifyContent = 'center'
    div.style.alignItems = 'center'

    div.style.borderRadius = '9999px'
    div.style.height = BadgeSize
    div.style.width = BadgeSize
    div.style.pointerEvents = 'none'
    div.style.zIndex = '10'

    this.badgeElement = div

    this.deactivate()
  }

  public activate(): void {
    const count = this.store.of('textChatPlugin').unreadCount
    this.badgeElement.textContent = count > 99 ? '99+' : count.toString()
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
