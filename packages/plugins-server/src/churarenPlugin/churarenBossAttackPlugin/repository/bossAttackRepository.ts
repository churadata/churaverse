import { CollidableEntityRepository } from '@churaverse/collision-detection-plugin-server'
import type { BossAttack } from '../domain/bossAttack'
import type { IBossAttackRepository } from '../domain/IBossAttackRepository'

export class BossAttackRepository extends CollidableEntityRepository<BossAttack> implements IBossAttackRepository {
  private readonly bossAttack = new Map<string, BossAttack>()

  public set(id: string, bossAttack: BossAttack): void {
    super.set(id, bossAttack)
    this.bossAttack.set(id, bossAttack)
  }

  public delete(id: string): void {
    super.delete(id)
    this.bossAttack.delete(id)
  }

  public get(id: string): BossAttack | undefined {
    return this.bossAttack.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.bossAttack.keys())
  }

  public get size(): number {
    return this.bossAttack.size
  }

  public clear(): void {
    this.getAllId().forEach((id) => {
      super.delete(id)
    })
    this.bossAttack.clear()
  }
}
