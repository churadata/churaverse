import { IServerErrorRender } from '../IRender/IServerErrorRender'

export interface IServerErrorRenderFactory {
  build: () => Promise<IServerErrorRender>
}
