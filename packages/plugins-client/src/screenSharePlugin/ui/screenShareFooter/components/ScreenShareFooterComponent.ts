import styles from './ScreenShareFooterComponent.module.scss'

export class ScreenShareFooterComponent {
  private readonly element: HTMLDivElement
  private readonly nameElement: HTMLSpanElement
  private readonly suffixText: HTMLSpanElement

  public constructor() {
    this.element = document.createElement('div')
    this.element.className = `${styles.footerContainer} ${styles.hidden}`

    this.nameElement = document.createElement('span')
    this.nameElement.className = styles.sharerName
    this.suffixText = document.createElement('span')
    this.suffixText.className = styles.suffixText

    this.element.appendChild(this.nameElement)
    this.element.appendChild(this.suffixText)

    document.body.appendChild(this.element)
  }

  public show(sharerName: string, isOwn: boolean): void {
    if (isOwn) {
      this.element.classList.add(styles.isOwn)
      this.nameElement.innerText = '● あなた'
    } else {
      this.element.classList.remove(styles.isOwn)
      this.nameElement.innerText = sharerName
    }

    this.suffixText.innerText = 'が画面共有しています'
    this.element.classList.remove(styles.hidden)
  }

  public hide(): void {
    this.element.classList.add(styles.hidden)
  }
}
