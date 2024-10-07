import { CollidableEntityRepository } from '../../plugins/collisionDetectionPlugin/domain/collisionDetection/collidableEntityRepository'
import { Bomb } from '../model/bomb'

export type IBombRepository = CollidableEntityRepository<Bomb>
