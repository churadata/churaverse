import { Scene } from 'phaser'
import { IMapRenderFactory } from '../../../domain/IRenderFactory/IMapRenderFactory'
import { MapRender } from '../Render/mapRender'
import { MapJsonLoader } from '../../map/mapJsonLoader'

export class MapRenderFactory implements IMapRenderFactory {
  public constructor(private readonly scene: Scene) {}

  public async build(mapName: string): Promise<MapRender> {
    const mapJson = await MapJsonLoader.getMapJSON(mapName)
    return await MapRender.build(this.scene, mapName, mapJson)
  }
}
