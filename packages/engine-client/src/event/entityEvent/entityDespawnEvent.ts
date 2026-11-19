import type { Entity } from '../../domain/model/entity'
import type { IMainScene } from '../../scene/IScene/IMainScene'
import { CVEvent } from '../cvEvent'

/**
 * Entityがワールドから削除されるイベント
 */
export class EntityDespawnEvent extends CVEvent<IMainScene> {
  public constructor(public readonly entity: Entity) {
    super('entityDespawn', true)
  }
}

declare module '../../event/events' {
  export interface CVMainEventMap {
    entityDespawn: EntityDespawnEvent
  }
}
