import type { Entity } from '../../domain/model/entity'
import type { IMainScene } from '../../scene/IScene/IMainScene'
import { CVEvent } from '../cvEvent'

/**
 * ワールドにEntityが生成されるイベント
 */
export class EntitySpawnEvent extends CVEvent<IMainScene> {
  public constructor(public readonly entity: Entity) {
    super('entitySpawn', true)
  }
}

declare module '../../event/events' {
  export interface CVMainEventMap {
    entitySpawn: EntitySpawnEvent
  }
}
