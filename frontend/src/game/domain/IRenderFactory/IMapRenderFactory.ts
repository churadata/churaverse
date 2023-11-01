import { IMapRender } from '../IRender/IMapRender'

export interface IMapRenderFactory {
  build: (mapName: string) => Promise<IMapRender>
}
