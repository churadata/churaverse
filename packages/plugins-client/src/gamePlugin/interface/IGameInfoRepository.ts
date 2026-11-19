import type { GameIds } from './gameIds'
import type { IGameInfo } from './IGameInfo'

/**
 * 各ゲームのメタ情報を管理するリポジトリのインターフェース
 */
export interface IGameInfoRepository {
  set: (id: GameIds, entity: IGameInfo) => void
  delete: (id: GameIds) => void
  get: (id: GameIds) => IGameInfo | undefined
  getAllId: () => GameIds[]
}
