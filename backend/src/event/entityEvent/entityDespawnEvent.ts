import { CVEvent } from '../cvEvent'
import { IMainScene } from '../../scene/IScene/IMainScene'
import { Entity } from '../../domain/model/entity'

/**
 * Entityがワールドから削除されるイベント
 */
export class EntityDespawnEvent extends CVEvent<IMainScene, 'entityDespawn'> {
  public constructor(public readonly entity: Entity) {
    super('entityDespawn', true)
  }
}

declare module '../../event/events' {
  export interface CVMainEventMap {
    entityDespawn: EntityDespawnEvent
  }
}
