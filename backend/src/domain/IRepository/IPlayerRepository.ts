import { CollidableEntityRepository } from '../../plugins/collisionDetectionPlugin/domain/collisionDetection/collidableEntityRepository'
import { Player } from '../model/player'

export type IPlayerRepository = CollidableEntityRepository<Player>
