import { CVEvent, type Scenes } from 'churaverse-engine-client'
import type { CvUi } from '../cvUi'

/**
 * ダイアログを閉じた時などUIへの入力が無効になった際に発火するイベント
 */
export class DeactivateUiEvent extends CVEvent<Scenes> {
  public constructor(public readonly targetUi: CvUi) {
    super('deactivateUiEvent', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    deactivateUiEvent: DeactivateUiEvent
  }
  export interface CVTitleEventMap {
    deactivateUiEvent: DeactivateUiEvent
  }
}
