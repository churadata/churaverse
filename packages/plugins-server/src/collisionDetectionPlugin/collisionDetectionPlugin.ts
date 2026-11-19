import { BasePlugin, type IMainScene } from 'churaverse-engine-server'
import { CollisionDetector } from './collisionDetector'
import { RegisterOnOverlapEvent } from './event/registerOnOverlap'
import { initCollisionDetectionPluginStore } from './store/initCollisionDetectionPluginStore'

export class CollisionDetectionPlugin extends BasePlugin<IMainScene> {
  private readonly collisionDetector = new CollisionDetector()

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('start', this.start.bind(this))
    this.bus.subscribeEvent('update', this.update.bind(this))
  }

  private init(): void {
    initCollisionDetectionPluginStore(this.store, this.collisionDetector)
  }

  private start(): void {
    this.bus.post(new RegisterOnOverlapEvent(this.collisionDetector))
  }

  private update(): void {
    this.collisionDetector.detectAllTasks()
  }
}
