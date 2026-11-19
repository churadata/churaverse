import type { GameIds } from '../interface/gameIds'
import type { IGameInfo } from '../interface/IGameInfo'
import type { IGameInfoRepository } from '../interface/IGameInfoRepository'
/**
 * 各ゲームのメタ情報を管理するリポジトリ
 */
export class GameInfoRepository implements IGameInfoRepository {
  private readonly games = new Map<GameIds, IGameInfo>()

  public set(id: GameIds, entity: IGameInfo): void {
    this.games.set(id, entity)
  }

  public delete(id: GameIds): void {
    this.games.delete(id)
  }

  public get(id: GameIds): IGameInfo | undefined {
    return this.games.get(id)
  }

  public getAllId(): GameIds[] {
    return Array.from(this.games.keys())
  }
}
