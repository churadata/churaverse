import { CVEvent, type ITitleScene } from 'churaverse-engine-client'
import type { CvUi } from '../cvUi'

/**
 * ダイアログを開いた時などUIへの入力が有効になった際に発火するイベント
 */
export class ActivateUiEvent extends CVEvent<ITitleScene> {
  public constructor(public readonly targetUi: CvUi) {
    super('activateUiEvent', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    activateUiEvent: ActivateUiEvent
  }
  export interface CVTitleEventMap {
    activateUiEvent: ActivateUiEvent
  }
}
