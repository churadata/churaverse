import type { HealingPotion } from '../domain/healingPotion'

export class HealingPotionRepository {
  private readonly healingPotions = new Map<string, HealingPotion>()

  public set(id: string, entity: HealingPotion): void {
    this.healingPotions.set(id, entity)
  }

  public delete(id: string): void {
    this.healingPotions.delete(id)
  }

  public get(id: string): HealingPotion | undefined {
    return this.healingPotions.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.healingPotions.keys())
  }

  public get size(): number {
    return this.healingPotions.size
  }
}
