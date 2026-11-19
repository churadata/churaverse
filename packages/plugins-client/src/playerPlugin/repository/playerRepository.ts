import type { Player } from '../domain/player'

/**
 * Playerのインスタンスを格納する場所
 */
export class PlayersRepository {
  private readonly players = new Map<string, Player>()

  public set(id: string, player: Player): void {
    this.players.set(id, player)
  }

  public delete(id: string): void {
    this.players.delete(id)
  }

  public get(id: string): Player | undefined {
    return this.players.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.players.keys())
  }

  get size(): number {
    return this.players.size
  }
}
