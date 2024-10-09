import { CollidableEntityRepository } from '../../plugins/collisionDetectionPlugin/domain/collisionDetection/collidableEntityRepository'
import { Shark } from '../model/shark'

export type ISharkRepository = CollidableEntityRepository<Shark>
