import { DeathLog } from '../model/deathLog'

export class DeathLogService {
  public readonly deathLogs: DeathLog[] = []

  public addDeathLog(message: DeathLog): void {
    this.deathLogs.push(message)
  }

  public allDeathLog(): DeathLog[] {
    return [...this.deathLogs]
  }
}
