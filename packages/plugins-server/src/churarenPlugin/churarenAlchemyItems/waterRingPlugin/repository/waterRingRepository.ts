import { CollidableEntityRepository } from '@churaverse/collision-detection-plugin-server'
import type { IWaterRingRepository } from '../domain/IWaterRingRepository'
import type { WaterRing } from '../domain/waterRing'

export class WaterRingRepository extends CollidableEntityRepository<WaterRing> implements IWaterRingRepository {
  private readonly waterRings = new Map<string, WaterRing>()

  public set(id: string, entity: WaterRing): void {
    super.set(id, entity)
    this.waterRings.set(id, entity)
  }

  public delete(id: string): void {
    super.delete(id)
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
}
