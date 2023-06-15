import { DeathLog } from '../model/deathLog'
import { TextChat } from '../model/textChat'

export class DeathLogService {
  public readonly deathLogs: DeathLog[] = []

  public addDeathLog(message: DeathLog): void {
    this.deathLogs.push(message)
  }

  public allDeathLog(): DeathLog[] {
    return [...this.deathLogs]
  }
}
