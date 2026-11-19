import type { GameUiRegister } from './gameUiRegister'
import type { GameIds } from './interface/gameIds'
import type { IGameUiComponent } from './interface/IGameUiComponent'
import type { IGameUiManager } from './interface/IGameUiManager'

export class GameUiManager implements IGameUiManager {
  public constructor(private readonly gameUiRegister: GameUiRegister) {}

  /**
   * 引数で指定したGameIdのUIを初期化する
   */
  public initializeAllUis(gameId: GameIds): void {
    const components = this.getAllUiComponents(gameId)
    components.forEach((component) => {
      component.initialize()
      if (!component.visible) {
        component.element.style.display = 'none'
      }
    })
  }

  /**
   * 引数で指定したGameIdとUiNameに対応するUIを取得する
   */
  public getUi<K extends GameUiName>(gameId: GameIds, uiName: K): GameUiMap[GameIds][K] | undefined {
    return this.gameUiRegister.getUiComponent(gameId, uiName)
  }

  /**
   * 特定のGameIdのUIを全て削除する
   */
  public removeAllUis(gameId: GameIds): void {
    const components = this.getAllUiComponents(gameId)
    components.forEach((component) => {
      component.remove()
      component.element.remove()
    })
  }

  /**
   * GameIdに紐づく全コンポーネントを取得
   */
  private getAllUiComponents(gameId: GameIds): IGameUiComponent[] {
    return this.gameUiRegister.getAllUiComponents(gameId)
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GameUiMap {}
export type GameUiName = keyof GameUiMap[GameIds]
