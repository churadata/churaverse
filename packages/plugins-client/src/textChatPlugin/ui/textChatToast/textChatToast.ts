import { DomManager } from 'churaverse-engine-client'
import type { TextChat } from '../../model/textChat'
import type { IChatToastRenderer } from '../interface/IChatToastRenderer'
import { TextChatToastComponent } from './components/TextChatToastComponent'
import style from './components/TextChatToastComponent.module.scss'

const MAX_TOAST_COUNT = 3
const TOAST_DISPLAY_DURATION = 3500
const FADE_OUT_DURATION = 500

export class TextChatToast implements IChatToastRenderer {
  private activeToasts: HTMLElement[] = []
  private readonly container: HTMLDivElement

  public constructor(private readonly onOpenChat: () => void) {
    this.container = document.createElement('div')
    this.container.className = style.toastListContainer
    document.body.appendChild(this.container)
  }

  public show(textChat: TextChat): void {
    if (this.activeToasts.length >= MAX_TOAST_COUNT) {
      const oldest = this.activeToasts[0]
      this.removeToast(oldest)
    }

    const toastElement = DomManager.jsxToDom(TextChatToastComponent({ textChat }))

    this.container.prepend(toastElement)
    this.activeToasts.push(toastElement)

    const closeButtonId = `toast-close-${textChat.playerId}`
    const closeButton = DomManager.getElementById(closeButtonId)

    closeButton?.addEventListener('click', (event) => {
      event.stopPropagation()
      this.removeToast(toastElement)
    })

    // 本体クリック（ダイアログを開く）
    toastElement.addEventListener('click', () => {
      this.removeToast(toastElement)
      this.onOpenChat()
    })

    setTimeout(() => {
      this.removeToast(toastElement)
    }, TOAST_DISPLAY_DURATION)
  }

  private removeToast(element: HTMLElement): void {
    if (!element.isConnected) return
    element.classList.add(style.fadeOut)
    setTimeout(() => {
      element.remove()
      this.activeToasts = this.activeToasts.filter((t) => t !== element)
    }, FADE_OUT_DURATION)
  }
}
