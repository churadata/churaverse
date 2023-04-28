import { CollidableEntityRepository } from '../core/collisionDetection/collidableEntityRepository'
import { Bomb } from '../model/bomb'

export type IBombRepository = CollidableEntityRepository<Bomb>
