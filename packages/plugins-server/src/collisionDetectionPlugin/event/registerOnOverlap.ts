import { CVEvent, type IMainScene } from 'churaverse-engine-server'
import type { ICollisionDetector } from '../interface/ICollisionDetector'

/**
 * 衝突時のcallbackを登録するイベント
 */
export class RegisterOnOverlapEvent extends CVEvent<IMainScene> {
  public constructor(public readonly collisionDetector: ICollisionDetector) {
    super('registerOnOverlap', false)
  }
}

declare module 'churaverse-engine-server' {
  export interface CVMainEventMap {
    registerOnOverlap: RegisterOnOverlapEvent
  }
}
