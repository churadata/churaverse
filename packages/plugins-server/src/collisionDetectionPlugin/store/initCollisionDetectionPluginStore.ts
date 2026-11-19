import type { IMainScene, Store } from 'churaverse-engine-server'
import type { CollisionDetector } from '../collisionDetector'
import type { CollisionDetectionPluginStore } from './defCollisionDetectionPluginStore'

export function initCollisionDetectionPluginStore(
  store: Store<IMainScene>,
  collisionDetector: CollisionDetector
): void {
  const collisionDetectionPluginStore: CollisionDetectionPluginStore = {
    collisionDetector,
  }

  store.setInit('collisionDetectionPlugin', collisionDetectionPluginStore)
}
