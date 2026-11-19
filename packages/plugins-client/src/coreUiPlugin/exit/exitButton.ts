import { DomManager, domLayerSetting, type IEventBus, type IMainScene } from 'churaverse-engine-client'
import exitIconImage from '../assets/exit.png'
import { OwnPlayerExitEvent } from '../event/ownPlayerExitEvent'
import type { IExitButton } from '../interface/IExitButton'

export class ExitButton implements IExitButton {
  public constructor(
    public eventBus: IEventBus<IMainScene>,
    public exitMessage: string = 'このミーティングから退出しますか？'
  ) {
    // 退出ボタンの位置･見た目設定
    const img = document.createElement('img')
    img.style.opacity = '0.5'
    img.style.width = '40px'
    img.style.height = '40px'
    img.style.top = '50px'
    img.style.left = '50px'
    img.src = exitIconImage

    img.addEventListener('click', () => {
      this.onClick()
    })

    domLayerSetting(img, 'higher')

    DomManager.addDom(img)
  }

  /** buttonが押されたときの動作 */
  private onClick(): void {
    const isPlayerKicked = window.confirm(this.exitMessage)
    if (isPlayerKicked) {
      const ownPlayerExitEvent = new OwnPlayerExitEvent()
      this.eventBus.post(ownPlayerExitEvent)
    }
  }

  public setExitMessage(message: string): void {
    this.exitMessage = message
  }
}
