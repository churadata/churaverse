import { CollidableEntityRepository } from '../core/collisionDetection/collidableEntityRepository'
import { Player } from '../model/player'

export type IPlayerRepository = CollidableEntityRepository<Player>
