import { DomManager } from '../../../domManager'
import { DebugSummaryScreen } from '../debugSummaryScreen'
import { IPlayerHpDebugScreen } from '../../../../../domain/IRender/IDebugRender/IPlayerInfoDebugScreen'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'

export class PlayerHpDebugScreen implements IPlayerHpDebugScreen {
  private content: HTMLElement

  public constructor(hp: number, settingDialog: DebugSummaryScreen) {
    const element = `Hp: ${hp}`
    this.content = DomManager.jsxToDom(ElementDebugScreenComponent({ element }))
    settingDialog.addContent('playerInfo', this.content)
  }

  public static build(hp: number, settingDialog: DebugSummaryScreen): PlayerHpDebugScreen {
    return new PlayerHpDebugScreen(hp, settingDialog)
  }

  public update(hp: number): void {
    this.content.textContent = `Hp:  ${hp}`
  }

  public dump(): string {
    const innerHTML = this.content.innerHTML
    const match = /Hp: (\d+)/.exec(innerHTML)
    if (match !== null) {
      const hpValue = match[1]
      return hpValue
    } else {
      return 'undefined'
    }
  }
}
