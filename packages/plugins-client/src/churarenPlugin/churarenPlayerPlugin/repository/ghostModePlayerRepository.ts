import type { Player } from '@churaverse/player-plugin-client'
import type { IGhostModePlayerRepository } from '../interface/IGhostModePlayerRepository'

export class GhostModePlayerRepository implements IGhostModePlayerRepository {
  private readonly ghostModePlayers = new Map<string, Player>()

  public set(playerId: string, entity: Player): void {
    this.ghostModePlayers.set(playerId, entity)
  }

  public delete(playerId: string): void {
    this.ghostModePlayers.delete(playerId)
  }

  public has(playerId: string): boolean {
    return this.ghostModePlayers.has(playerId)
  }

  public get(playerId: string): Player | undefined {
    return this.ghostModePlayers.get(playerId)
  }

  public getAllId(): string[] {
    return Array.from(this.ghostModePlayers.keys())
  }

  public getPlayerNames(): string[] {
    return Array.from(this.ghostModePlayers.values()).map((player) => player.name)
  }

  public get size(): number {
    return this.ghostModePlayers.size
  }
}
