import type { ICollidableEntity } from './domain/collisionDetection/collidableEntity/ICollidableEntity'
import type { CollidableEntityRepository } from './domain/collisionDetection/collidableEntityRepository'
import { detectEntityOverlap, type OnOverlap } from './domain/collisionDetection/collistionDetection'
import type { ICollisionDetector } from './interface/ICollisionDetector'

interface DetectionTask<T1 extends ICollidableEntity, T2 extends ICollidableEntity> {
  entityRepository1: CollidableEntityRepository<T1>
  entityRepository2: CollidableEntityRepository<T2>
  onOverlap: OnOverlap<T1, T2>
}

export class CollisionDetector implements ICollisionDetector {
  private readonly detectionTasks: Array<DetectionTask<any, any>> = []

  public register<T1 extends ICollidableEntity, T2 extends ICollidableEntity>(
    entityRepository1: CollidableEntityRepository<T1>,
    entityRepository2: CollidableEntityRepository<T2>,
    onOverlap: OnOverlap<T1, T2>
  ): void {
    this.detectionTasks.push({ entityRepository1, entityRepository2, onOverlap })
  }

  public detectAllTasks(): void {
    this.detectionTasks.forEach((task) => {
      detectEntityOverlap(task.entityRepository1, task.entityRepository2, task.onOverlap)
    })
  }
}
