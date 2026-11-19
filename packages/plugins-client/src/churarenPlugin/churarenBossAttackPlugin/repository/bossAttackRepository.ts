import type { BossAttack } from '../domain/bossAttack'

/**
 * BossAttackのインスタンスを格納する場所
 */
export class BossAttackRepository {
  private readonly bossAttacks = new Map<string, BossAttack>()

  public set(id: string, bossAttack: BossAttack): void {
    this.bossAttacks.set(id, bossAttack)
  }

  public delete(id: string): void {
    this.bossAttacks.delete(id)
  }

  public get(id: string): BossAttack | undefined {
    return this.bossAttacks.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.bossAttacks.keys())
  }

  public get size(): number {
    return this.bossAttacks.size
  }
}
