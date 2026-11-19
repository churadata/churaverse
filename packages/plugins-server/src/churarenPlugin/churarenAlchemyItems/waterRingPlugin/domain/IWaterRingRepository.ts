import type { CollidableEntityRepository } from '@churaverse/collision-detection-plugin-server'
import type { WaterRing } from './waterRing'

export interface IWaterRingRepository extends CollidableEntityRepository<WaterRing> {
  getByOwnerId: (ownerId: string) => WaterRing | undefined
}
