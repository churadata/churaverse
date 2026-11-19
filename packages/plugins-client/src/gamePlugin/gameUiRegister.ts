import { GameUiComponentNotFoundError } from './errors/gameUiComponentNotFoundError'
import type { GameUiMap, GameUiName } from './gameUiManager'
import type { GameIds } from './interface/gameIds'
import type { IGameUiComponent } from './interface/IGameUiComponent'

export class GameUiRegister {
  private readonly gameUiRegister = new Map<GameIds, Map<GameUiName, IGameUiComponent>>()

  /**
   * gameUiComponentを登録する
   * @param gameId ゲームID
   * @param uiName UI名
   * @param gameUiComponent 登録するUIコンポーネント
   */
  public registerGameUi(gameId: GameIds, uiName: GameUiName, gameUiComponent: IGameUiComponent): void {
    if (!this.gameUiRegister.has(gameId)) {
      this.gameUiRegister.set(gameId, new Map<GameUiName, IGameUiComponent>())
    }
    const uiMap = this.gameUiRegister.get(gameId)
    if (uiMap === undefined) throw new GameUiComponentNotFoundError(gameId)
    uiMap.set(uiName, gameUiComponent)
  }

  /**
   * 登録されたgameUiComponentを取得する
   * @param gameId ゲームID
   * @param uiName UI名
   */
  public getUiComponent<K extends GameUiName>(gameId: GameIds, uiName: K): GameUiMap[GameIds][K] | undefined {
    const uiMap = this.gameUiRegister.get(gameId)
    if (uiMap !== undefined) {
      const component = uiMap.get(uiName)
      if (component !== undefined) {
        return component as GameUiMap[GameIds][K]
      }
    }
    return undefined
  }

  /**
   * GameIdに紐づく全コンポーネントを取得
   */
  public getAllUiComponents(gameId: GameIds): IGameUiComponent[] {
    const uiMap = this.gameUiRegister.get(gameId)
    if (uiMap === undefined) throw new GameUiComponentNotFoundError(gameId)
    return Array.from(uiMap.values())
  }
}
