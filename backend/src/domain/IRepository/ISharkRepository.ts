import { CollidableEntityRepository } from '../core/collisionDetection/collidableEntityRepository'
import { Shark } from '../model/shark'

export type ISharkRepository = CollidableEntityRepository<Shark>
