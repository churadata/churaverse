import type { Player } from '@churaverse/player-plugin-server'
import type { IGhostModePlayerRepository } from '../interface/IGhostModePlayerRepository'

export class GhostModePlayerRepository implements IGhostModePlayerRepository {
  private readonly ghostModePlayers = new Map<string, Player>()

  public set(id: string, player: Player): void {
    this.ghostModePlayers.set(id, player)
  }

  public has(id: string): boolean {
    return this.ghostModePlayers.has(id)
  }

  public delete(id: string): void {
    this.ghostModePlayers.delete(id)
  }

  public clear(): void {
    this.ghostModePlayers.clear()
  }

  public getAllId(): string[] {
    return Array.from(this.ghostModePlayers.keys())
  }

  public getRandomPlayerId(): string {
    const playerIds = this.getAllId()
    return playerIds[Math.floor(Math.random() * playerIds.length)]
  }

  public get size(): number {
    return this.ghostModePlayers.size
  }
}
