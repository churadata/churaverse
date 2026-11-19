import type { ICollisionDetector } from '../interface/ICollisionDetector'

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    collisionDetectionPlugin: CollisionDetectionPluginStore
  }
}

export interface CollisionDetectionPluginStore {
  collisionDetector: ICollisionDetector
}
