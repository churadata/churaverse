import { Scene } from 'phaser'
import { ISharkRender } from '../../../domain/IRender/ISharkRender'
import { SharkRender } from '../Render/entity/sharkRender'
import { ISharkRenderFactory } from '../../../domain/IRenderFactory/ISharkRenderFactory'

export class SharkRenderFactory implements ISharkRenderFactory {
  public constructor(private readonly scene: Scene) {}

  public async build(): Promise<ISharkRender> {
    return await SharkRender.build(this.scene)
  }
}
