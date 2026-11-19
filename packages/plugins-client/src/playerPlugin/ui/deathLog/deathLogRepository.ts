import type { DeathLog } from './deathLog'

export class DeathLogRepository {
  private readonly deathLogs: DeathLog[] = []

  public addDeathLog(message: DeathLog): void {
    this.deathLogs.push(message)
  }

  public allDeathLog(): DeathLog[] {
    return [...this.deathLogs]
  }
}
