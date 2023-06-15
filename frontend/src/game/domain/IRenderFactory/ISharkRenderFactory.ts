import { ISharkRender } from '../IRender/ISharkRender'

export interface ISharkRenderFactory {
  build: () => Promise<ISharkRender>
}
