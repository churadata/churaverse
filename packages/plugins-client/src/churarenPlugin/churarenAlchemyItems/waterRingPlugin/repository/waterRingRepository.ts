import type { WaterRing } from '../domain/waterRing'

export class WaterRingRepository {
  private readonly waterRings = new Map<string, WaterRing>()

  public set(id: string, entity: WaterRing): void {
    this.waterRings.set(id, entity)
  }

  public delete(id: string): void {
    this.waterRings.delete(id)
  }

  public get(id: string): WaterRing | undefined {
    return this.waterRings.get(id)
  }

  public getAllId(): string[] {
    return Array.from(this.waterRings.keys())
  }

  public getByOwnerId(ownerId: string): WaterRing | undefined {
    return Array.from(this.waterRings.values()).find((waterRing) => waterRing.churarenWeaponOwnerId === ownerId)
  }

  public clear(): void {
    this.waterRings.clear()
  }

  public get size(): number {
    return this.waterRings.size
  }
}
