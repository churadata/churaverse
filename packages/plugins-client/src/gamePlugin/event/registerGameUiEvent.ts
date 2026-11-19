import { CVEvent, type IMainScene } from 'churaverse-engine-client'
import type { GameUiRegister } from '../gameUiRegister'

/**
 *  ゲームUIの登録を行うイベント
 */
export class RegisterGameUiEvent extends CVEvent<IMainScene> {
  public constructor(public readonly gameUiRegister: GameUiRegister) {
    super('registerGameUi', false)
  }
}

declare module 'churaverse-engine-client' {
  export interface CVMainEventMap {
    registerGameUi: RegisterGameUiEvent
  }
}
