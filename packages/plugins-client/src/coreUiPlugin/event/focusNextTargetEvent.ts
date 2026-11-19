import { CVEvent, type IMainScene } from 'churaverse-engine-client'
/**
 * フォーカスを切り替える際に発火するEvent
 */
export class FocusNextTargetEvent extends CVEvent<IMainScene> {
  public constructor() {
    super('focusNextTarget', true)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    focusNextTarget: FocusNextTargetEvent
  }
}
