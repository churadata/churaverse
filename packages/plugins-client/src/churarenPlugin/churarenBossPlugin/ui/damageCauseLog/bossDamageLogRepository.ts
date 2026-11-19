import type { BossDamageCauseLog } from './bossDamageCauseLog'

export class BossDamageCauseLogRepository {
  private readonly bossDamageCauseLogs: BossDamageCauseLog[] = []

  public addDamageCauseLog(damageCauseLog: BossDamageCauseLog): void {
    this.bossDamageCauseLogs.push(damageCauseLog)
  }

  public allbossDamageCauseLogs(): BossDamageCauseLog[] {
    return [...this.bossDamageCauseLogs]
  }
}
