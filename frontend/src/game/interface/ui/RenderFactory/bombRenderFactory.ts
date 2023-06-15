import { Scene } from 'phaser'
import { IBombRender } from '../../../domain/IRender/IBombRender'
import { BombRender } from '../Render/entity/bombRender'
import { IBombRenderFactory } from '../../../domain/IRenderFactory/IBombRenderFactory'

export class BombRenderFactory implements IBombRenderFactory {
  public constructor(private readonly scene: Scene) {}

  public async build(): Promise<IBombRender> {
    return await BombRender.build(this.scene)
  }
}
