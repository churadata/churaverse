import { Scene } from 'phaser'
import { Interactor } from '../../../../interactor/Interactor'

import { DomManager } from '../../domManager'
import { DebugSummaryScreen } from './debugSummaryScreen'

/**
 * キーバインドフォームを開くボタン要素のid
 */
export const DEBUG_SCREEN_DUMP_BUTTON_ID = 'debugScreen-dump-button'

export class DebugScreenDumpButton {
  private interactor?: Interactor

  public constructor(scene: Scene, debugScreenDialog: DebugSummaryScreen) {
    this.setupDumpButton()
  }

  public static async build(scene: Scene, debugScreenDialog: DebugSummaryScreen): Promise<DebugScreenDumpButton> {
    return new DebugScreenDumpButton(scene, debugScreenDialog)
  }

  public dump(): void {
    if (this.interactor === undefined) return
    this.interactor.debugScreenDump()
  }

  private setupDumpButton(): void {
    const button = DomManager.getElementById(DEBUG_SCREEN_DUMP_BUTTON_ID)

    button.onclick = () => {
      this.dump()
    }
  }

  public setInteractor(interactor: Interactor): void {
    this.interactor = interactor
  }
}
