import { Scene } from 'phaser'
import { IServerErrorRenderFactory } from '../../../domain/IRenderFactory/IServerErrorRenderFactory'
import { IServerErrorRender } from '../../../domain/IRender/IServerErrorRender'
import { ServerErrorRender } from '../Render/serverErrorRender'

export class ServerErrorRenderFactory implements IServerErrorRenderFactory {
  public constructor(private readonly scene: Scene) {}

  public async build(): Promise<IServerErrorRender> {
    return await ServerErrorRender.build(this.scene)
  }
}
