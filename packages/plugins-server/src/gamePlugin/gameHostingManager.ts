import type { IGameHostingManager } from './interface/IGameHostingManager'

/**
 * 各ゲームのHosting時のプレイヤー管理を行うクラス
 * - 参加可否の回答管理
 * - タイムアウト時の自動不参加設定
 */
export class GameHostingManager implements IGameHostingManager {
  /** ミニゲーム対象の全プレイヤー */
  private readonly allPlayers: Set<string>
  /** 「参加する」と回答したプレイヤー */
  private readonly joinedPlayers: Set<string>
  /** 回答済み（参加/不参加問わず）のプレイヤー */
  private readonly respondedPlayers: Set<string>

  public constructor(allPlayers: string[]) {
    this.allPlayers = new Set(allPlayers)
    this.joinedPlayers = new Set<string>()
    this.respondedPlayers = new Set<string>()
  }

  public set(playerId: string, willJoin: boolean): void {
    this.respondedPlayers.add(playerId)
    if (willJoin) this.joinedPlayers.add(playerId)
  }

  public isAllPlayersResponded(): boolean {
    return this.allPlayers.size === this.respondedPlayers.size
  }

  public getJoinedPlayerIds(): string[] {
    return Array.from(this.joinedPlayers)
  }

  public timeoutResponse(): void {
    this.allPlayers.forEach((playerId) => {
      if (this.respondedPlayers.has(playerId)) return
      this.respondedPlayers.add(playerId)
    })
  }
}
